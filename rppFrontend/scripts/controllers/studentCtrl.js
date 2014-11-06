'use strict';

angular.module('rppFrontEnd')
.controller('StudentCtrl', ['$scope','$location','$routeParams','StudentService','$localStorage','LoginService', function ($scope,$location,$routeParams,StudentService,$localStorage,LoginService) {
	
	$scope.init = function(){
		$scope.user = $localStorage.user || LoginService.getUser();
		$scope.info = $localStorage.info || LoginService.getUserInfo();
		$scope.student = {};
	};

	$scope.getStudentDetails = function(){
		if($routeParams && $routeParams.student){
			StudentService.getStudentDetails($routeParams.student).then(function(data){
				if(data.data.length == 0) {
					helper.error("Student details not found!");
					return;
				}
				$scope.student = data.data[0];
				$scope.getStudentProgress();
			}).catch(function(err){
				helper.errorHandler(err,"Student details not found!");
			});
		} else {
			helper.error("Student details not found!");
		}
	};

	$scope.getStudentProgress = function(){
		if($routeParams && $routeParams.student){
			StudentService.getStudentProgress($routeParams.student).then(function(data){
				if(data.data.length == 0) {
					helper.error("Student progress not found!");
					return;
				}
				$scope.studentProgress = data.data[0];
			}).catch(function(err){
				helper.errorHandler(err,"Student progress not found!");
			});
		} else {
			helper.error("Student progress not found!");
		}
	};

	$scope.logout = function(){
		LoginService.logout();
		helper.success("Logged out!");
		$localStorage.$reset();
		$location.path('/');
		if(!$scope.$$phase) $scope.$apply()
	};

	$scope.getStudentDetails();

}]);