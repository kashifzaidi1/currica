'use strict';

angular.module('rppFrontEnd')
.controller('StudentTasksCtrl', 
	['$scope','$location','LoginService','$route','PathService','TaskService','SessionService','ApiService','$upload','$localStorage',
 function ($scope,$location,LoginService,$route,PathService,TaskService,SessionService,ApiService,$upload,$localStorage) {

	$scope.init = function(){
		$scope.user = $localStorage.user || LoginService.getUser();
		$scope.info = $localStorage.info || LoginService.getUserInfo();
		$scope.session = {};
		$scope.currentTaskID = "";
		$scope.leaderBoard = "";
		$scope.model = {};
		$scope.selectedFile = [];
		$scope.uploadProgress = 0;
		$scope.submittedComment = "";
		$scope.pathFinished = false;
		$scope.noTasksForToday = false;
		$scope.selectedPath = $scope.user.paths[0].PathId;
	};

	$scope.pathFinishCheck = function(){
		for(var i in $scope.session.tasks){
			if($scope.session.tasks[i]["isSubmitted"] == 0)
				return;
		}
		$scope.pathFinished = true;
	};

	$scope.checksForSession = function(){
		if($scope.session.tasks.length > 0){
			$scope.pathFinishCheck();
		} else {
			$scope.noTasksForToday = true;
		}
		
	};

	$scope.addIsCompletedProperty = function(){
		for(var i in $scope.session.tasks){
			$scope.session.tasks[i]["isSubmitted"] = 0;
			$scope.session.tasks[i]["recordExists"] = 0;
		}
	};

	$scope.setCurrentTaskId = function(taskID){
		$scope.currentTaskID = taskID;
	}

	$scope.startTask = function(taskID){
		TaskService.startTask(taskID,$scope.user.id).then(function(data){
			helper.success("Your Task has started! Time is being calculated.");
			$scope.loadTasks();
			$scope.loadLeaderBoard();
		}).catch(function(err){
			helper.errorHandler(err,"Unable to start the task at this time, Please try again later!");
		});
	};

	$scope.completeTask = function(){
		var file = $scope.selectedFile[0];
        $scope.upload = $upload.upload({
            url: ApiService.baseUri + "submittedTasks/submit",
            method: 'POST',
            data: {
            	submittedComment : $scope.submittedComment,
            	taskID : $scope.currentTaskID,
            	studentID : $scope.user.id,
            	sessionID : $scope.session.tasks[0].sessionId
            },
            file: file
        }).progress(function (evt) {
            $scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total, 10);
        }).success(function (data) {
            helper.hideCurrentActiveModal();
            helper.success('Task Submitted');
            if(typeof data.sessionFinished !== "undefined" && data.sessionFinished){
            	$scope.init();
            	helper.success("You have finished your sessions for today!");
            	$scope.noTasksForToday = true;
            } else {
            	$scope.init();
            	$scope.loadTasks();
            	$scope.loadLeaderBoard();
            }
        }).error(function (err) {
        	helper.hideCurrentActiveModal();
            helper.errorHandler(err,'Submission Failed.');
        })
	};

	$scope.onFileSelect = function ($files) {
        $scope.uploadProgress = 0;
        $scope.selectedFile = $files;
    };

	$scope.getRemaingTasksLength = function(){
		var remaining = 0;
		for(var i in $scope.session.tasks){
			if($scope.session.tasks[i].isSubmitted == false)
				remaining++;
		}
		return remaining;
	}
	
	$scope.getFirstSessionByPath = function(){
		SessionService.getSessionByPathID($scope.user.pathID).then(function(data){
			if(data.data.length > 0){
				$scope.session = data.data[0];
				$scope.addIsCompletedProperty();
				$scope.checksForSession()
			} else {
				$scope.noTasksForToday = true;
			}
		}).catch(function(err){
			$scope.noTasksForToday = true;
		});
	};

	$scope.loadSpecificSession = function(sessionID){
		SessionService.getSessionTasksByStudent(sessionID, $scope.user.id, $scope.selectedPath).then(function(sessionWithTasks){
			$scope.session = {tasks: sessionWithTasks.data};
			$scope.checksForSession();
		}).catch(function(err){
			$scope.getFirstSessionByPath();
		});
	};

	$scope.getFirstSessionByStudent = function(studentID){
		SessionService.getFirstSessionInPathForStudent(studentID,$scope.selectedPath).then(function(session){
			$scope.loadSpecificSession(session.data[0].id);
		}).catch(function(err){
			$scope.noTasksForToday = true;
		});
	}

	$scope.loadTasks = function(){
		SessionService.getNextSessionInPath($scope.user.id, $scope.selectedPath).then(function(session){
			$scope.loadSpecificSession(session.data.id);
		}).catch(function(err){
			$scope.getFirstSessionByStudent($scope.user.id);
		});
	};

	$scope.loadLeaderBoard = function(){
		TaskService.leaderBoard($scope.user.id, $scope.selectedPath).then(function(board){
			$scope.leaderBoard = board.data;
		}).catch(function(err){
			$scope.leaderBoard = {};
		});
	};

	$scope.logout = function(){
		LoginService.logout();
		helper.success("Logged out!");
		$localStorage.$reset();
		$location.path('/');
		if(!$scope.$$phase) $scope.$apply()
	};

	$scope.loadForPath = function(){
		$scope.loadTasks();
		$scope.loadLeaderBoard();
	};
	
	$scope.init();
	$scope.loadTasks();
	$scope.loadLeaderBoard();
	
}]);