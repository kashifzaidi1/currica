'use strict';

angular.module('rppFrontEnd')
.controller('LoginCtrl', ['$scope','$location','LoginService','StudentService','$localStorage', function ($scope,$location,LoginService,StudentService,$localStorage) {
	$scope.user = $localStorage.user || LoginService.getUser();
	$scope.info = $localStorage.info || LoginService.getUserInfo();

	$localStorage.$default({
    	user : $scope.user,
    	info : $scope.info
  	});

  	$scope.navigate = function(){
  		if($scope.info.isLoggedIn){
  			if($scope.info.type === "admin") $location.path("admin")
  			else if($scope.info.type === "teacher") $location.path("classes")
  			else $location.path('studentTasks');
  		}
  	};

  	$scope.navigate();

	$scope.reset = function(){
		$scope.useremail = "";
		$scope.userpassword = "";
		$scope.usertype = "Student";
	};

	$scope.getUserInfo = function(){
		//get info
		$scope.user = LoginService.getUser();
		$scope.info = LoginService.getUserInfo();

		// save in localstorage
		$localStorage.user = $scope.user;
		$localStorage.info = $scope.info;
	};

	$scope.login = function(){
		LoginService.login($scope.useremail,$scope.userpassword,$scope.usertype)
		.then(function(response){
			if(response.data && response.data.name){
				if($scope.usertype == "Student"){
					StudentService.markAttendance(response.data.id).then(function(suc){
						helper.success("Hello "+response.data.name +"! :)");
						$scope.getUserInfo();
					});
				} else {
					$scope.getUserInfo();
					helper.success("Hello "+response.data.name +"! :)");
				}
			}
			if($scope.usertype.toLowerCase() === "student") $location.path('studentTasks');
			else if($scope.usertype.toLowerCase() === "teacher") $location.path('classes');
			else $location.path('paths');
		}).catch(function(err){
			helper.errorHandler(err,"Login Failed!");
		});
	};

	$scope.reset();
}]);