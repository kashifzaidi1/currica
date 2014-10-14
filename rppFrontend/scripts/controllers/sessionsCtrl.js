'use strict';

angular.module('rppFrontEnd')
.controller('SessionsCtrl', ['$scope','$location','$routeParams','SessionService','LoginService','TaskService', '$localStorage', function ($scope,$location,$routeParams,SessionService,LoginService, TaskService,$localStorage) {

	$scope.init = function(){
        $scope.user = $localStorage.user || LoginService.getUser();
        $scope.info = $localStorage.info || LoginService.getUserInfo();
        $scope.newSessionName = "";
        $scope.newSessionDescription = "";
        $scope.addingTaskToSession = 0;
        $scope.addTaskName = "";
        $scope.addTaskLink = "";
        $scope.addTaskDescription = "";
        $scope.viewTaskData = {
            link : "",
            name : "",
            description : ""
        };
    };
    
    $scope.init();

    $scope.getSession = function(){
    	var functionToCall = 'getAll';
    	var id = 0;
    	
    	if($routeParams && $routeParams.path){
    		functionToCall = 'getSessionByPathID';
    		id = $routeParams.path;
    	}

    	SessionService[functionToCall](id).then(function(data){
    		$scope.sessions = data.data;
    	});
    };

    $scope.addNewSession = function(){
        if(!$routeParams || !$routeParams.path || $scope.newSessionName == "") {
            $.notify("Unable add new session at this moment, Please recheck the session name!");
            return;
        }

        SessionService.addNewSession($routeParams.path, $scope.newSessionName, $scope.newSessionDescription).then(function(data){
            $scope.getSession();
            helper.hideCurrentActiveModal();
            helper.success("Session Added");
            $scope.init();
            $scope.getSession();

        }).catch(function(err){
            helper.errorHandler(err,"Unable add new session at this moment. Please try again!");
            helper.hideCurrentActiveModal();
        });
    }

    $scope.removeTask = function(taskID){
        TaskService.remove(taskID).then(function(data){
            $scope.getSession();
        }).catch(function(err){
            helper.errorHandler(err,"Unable delete the task at this moment. Please try again!");
        });
    };

    $scope.removeSession = function(sessionID){
        SessionService.remove(sessionID).then(function(data){
            $scope.getSession();
        }).catch(function(err){
            helper.errorHandler(err,"Unable delete the session at this moment. Please try again!");
        });
    };

    $scope.viewTask = function(modalID, taskName, taskLink, taskDescription){
        $scope.viewTaskData = {
            name : taskName,
            link : taskLink,
            description : taskDescription
        };
        $("#"+modalID).modal('show')
    };

    $scope.setSessionIdToModal = function(sessionID){
        $scope.addingTaskToSession = sessionID;
    };


    $scope.addTaskToSession = function(){
        if($scope.addTaskName == "") {
            $.notify("Please recheck the Task name!");
            return;
        }

        var getSequenceNumber = function(){
            for(var session in $scope.sessions){
                if($scope.sessions[session].id == $scope.addingTaskToSession){
                    return $scope.sessions[session].tasks.length + 1;
                }
            }
            return 1;
        };

        TaskService.create($scope.addTaskName, $scope.addTaskLink, $scope.addTaskDescription, getSequenceNumber(), $scope.addingTaskToSession).then(function(data){
            helper.hideCurrentActiveModal();
            helper.success("Task Added");
            $scope.init();
            $scope.getSession();
        }).catch(function(err){
             helper.errorHandler(err,"Unable to add Task at this moment. Please try again!");
        });
    };

    $scope.logout = function(){
        LoginService.logout();
        helper.success("Logged out!");
        $localStorage.$reset();
        $location.path('/');
        if(!$scope.$$phase) $scope.$apply()
    };

    $scope.getSession();

	    
}]);