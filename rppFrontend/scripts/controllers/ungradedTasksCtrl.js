'use strict';

angular.module('rppFrontEnd')
.controller('UngradedTasksCtrl', ['$scope','$location','$routeParams','LoginService','TaskService','$localStorage', function ($scope,$location,$routeParams,LoginService,TaskService,$localStorage) {
	
	$scope.init = function(){
		$scope.tasks = {};
		$scope.user = $localStorage.user || LoginService.getUser();
		$scope.info = $localStorage.info || LoginService.getUserInfo();
		$scope.classID = "";
	};

	$scope.getTasks = function(){
		if($routeParams && $routeParams.classID){
			TaskService.getUngradedTasksGroupsByClass($routeParams.classID).then(function(data){
				$scope.classID = $routeParams.classID;
				$scope.tasks = data.data;
			}).catch(function(err){
				helper.errorHandler(err,"Failed to get the Ungraded tasks!");
			});
		} else {
			helper.error('No class detected!');
		}
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