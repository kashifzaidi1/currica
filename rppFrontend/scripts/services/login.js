
'use strict';
// interceptor service which can be used to control the requests
angular.module('rppFrontEnd')
  .factory('LoginService', ['ApiService','$localStorage', function(ApiService,$localStorage) {
	  var LoginService = {
	  	user : {},
	  	info : {
	  		isLoggedIn : false,
	  		type : "student"
	  	},

	  	getUser : function(){
	  		return LoginService.user;
	  	},

	  	getUserInfo : function(){
	  		return LoginService.info;
	  	},
	  	login : function(email, password, type) {
		    return ApiService.post(type+'s/login', { 
		    	email: email,
		    	password: password 
		    }).success(function(data){
		      LoginService.user = data;
		      LoginService.info = {
		      	isLoggedIn : true,
		      	type : type.toLowerCase()
		      };

		      $localStorage.user = LoginService.user;
		      $localStorage.info = LoginService.info;
		      
		    }).error(function(data){
		      LoginService.info.isLoggedIn = false;
		    });
		  },
		logout : function(){
			LoginService.info.isLoggedIn = false;
			$localStorage.$reset();
		}
	  };

	  return LoginService;
	}]);
