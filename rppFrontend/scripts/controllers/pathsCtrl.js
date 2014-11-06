'use strict';

angular.module('rppFrontEnd')
.controller('PathsCtrl', ['$scope','$location','LoginService','$route','PathService','$localStorage', function ($scope,$location,LoginService,$route,PathService,$localStorage) {

	$scope.init = function(){
		$scope.user = $localStorage.user || LoginService.getUser();
		$scope.info = $localStorage.info || LoginService.getUserInfo();
		$scope.newPathwayName = "";
	};

	$scope.getPaths = function(){
		PathService.getAll().then(function(data){
			$scope.pathways = data.data;
		}).catch(function(err){
			helper.errorHandler(err,"There are no pathways to display!");
		});
	};

	$scope.addNewPathway = function(){
		if($scope.newPathwayName == "") {
			helper.error("Enter a valid Pathway Name!");
			return;
		}

		PathService.addNew($scope.newPathwayName).then(function(data){
			$scope.getPaths();
			helper.hideCurrentActiveModal();
		}).catch(function(err){
			helper.errorHandler(err,"Unable add new pathways at this moment. Please try again!");
			helper.hideCurrentActiveModal();
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
	$scope.getPaths();
}]);