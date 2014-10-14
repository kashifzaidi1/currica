'use strict';

angular.module('rppFrontEnd')
.controller('GradeStudentsCtrl', ['$scope','$location','$routeParams','TaskService','LoginService','$localStorage', function ($scope,$location,$routeParams,TaskService,LoginService,$localStorage) {
	
	var selectors = {
		comment : "#Comment",
		score : "#Score"
	}

	$scope.init = function(){
		$scope.tasks = {};
		$scope.user = $localStorage.user || LoginService.getUser();
		$scope.info = $localStorage.info || LoginService.getUserInfo();
		$scope.noRecords = false;
	};

	$scope.getComment = function(taskID){
		return angular.element(selectors.comment+taskID).val() || "" ;
	};

	$scope.getScore = function(taskID){
		return angular.element(selectors.score+taskID).val() || 1 ;
	}

	$scope.getTasks = function(){
		if($routeParams && $routeParams.classID && $routeParams.taskID){
			TaskService.getUngradedTasksByClassAndTask($routeParams.classID,$routeParams.taskID).then(function(data){
				$scope.tasks = data.data;
			}).catch(function(err){
				helper.errorHandler(err,"Failed to get the Ungraded tasks!");
				$scope.noRecords = true;
			});
		} else {
			helper.error('No class detected!');
			$scope.noRecords = true;
		}
	};

	$scope.gradeTask = function(taskSubmissionID){
		TaskService.gradeTask(taskSubmissionID,$scope.getComment(taskSubmissionID),$scope.getScore(taskSubmissionID),$scope.user.id)
		.then(function(result){
			helper.success('Grades have been submitted');
			$scope.getTasks();
		}).catch(function(err){
			helper.errorHandler(err,"Try again later!");
		});
	};

	$scope.logout = function(){
		LoginService.logout();
		helper.success("Logged out!");
		$localStorage.$reset();
		$location.path('/');
		if(!$scope.$$phase) $scope.$apply()
	};

	$scope.init();
	$scope.getTasks();
}]);