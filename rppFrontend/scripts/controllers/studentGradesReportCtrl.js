'use strict';

angular.module('rppFrontEnd')
.controller('StudentGradesReportCtrl', ['$scope','$location','LoginService','$routeParams','TaskService','$localStorage', function ($scope,$location,LoginService,$routeParams,TaskService,$localStorage) {
	$scope.init = function(){
		$scope.user = $localStorage.user || LoginService.getUser();
		$scope.info = $localStorage.info || LoginService.getUserInfo();
		$scope.err = false;
		$scope.tasks = {};
	};

	$scope.addDifference = function(){
		for(var task in $scope.tasks){
			var ms = moment($scope.tasks[task].endTime,"DD/MM/YYYY HH:mm:ss").diff(moment($scope.tasks[task].startTime,"DD/MM/YYYY HH:mm:ss"));
			$scope.tasks[task]["difference"] = Math.floor(moment.duration(ms).asHours()) + moment.utc(ms).format(":mm:ss");
		}
	};

	$scope.getReport = function(){
		TaskService.getGradeReport($routeParams.student).then(function(success){
			if(success.data.length > 0){
				$scope.tasks = success.data;
				$scope.addDifference();
			}
			else {
				helper.error('No graded tasks yet!');	
				$scope.err = true;
			}
		}).catch(function(err){
			helper.errorHandler(err,'Cannot load the report this time');
			$scope.err = true;
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
	$scope.getReport();
}]);