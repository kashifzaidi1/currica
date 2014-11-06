'use strict';

angular.module('rppFrontEnd')
.controller('ClassesCtrl', ['$scope','$location','LoginService','ClassesService','$localStorage', function ($scope,$location,LoginService,ClassesService,$localStorage) {
	
	$scope.init = function(){
		$scope.user = $localStorage.user || LoginService.getUser();
		$scope.info = $localStorage.info || LoginService.getUserInfo();
		$scope.students = {};
		$scope.classes = {};
		$scope.assignedClass = "";
		
	};

	$scope.getAllClasses = function(){
		ClassesService.getAll().then(function(data){
			$scope.classes = data.data;
			$scope.assignedClass = $scope.classes[0].id;
		}).catch(function(err){
			helper.errorHandler(err,"Please add a Class!");
		});
	};

	$scope.populateFields = function(){
		$scope.getAllClasses();
	};

	$scope.logout = function(){
		LoginService.logout();
		helper.success("Logged out!");
		$localStorage.$reset();
		$location.path('/');
		if(!$scope.$$phase) $scope.$apply()
	};

	$scope.init();
	$scope.populateFields();

}]);