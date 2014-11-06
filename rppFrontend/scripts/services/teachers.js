
'use strict';

angular.module('rppFrontEnd')
  .factory('TeachersService', ['ApiService', function(ApiService) {
	  var TeachersService = {};
	  TeachersService.teachers = {};

	  TeachersService.getAll = function() {
	    return ApiService.get('teachers', {}).success(function(data){
	      TeachersService.teachers = data;
	    }).error(function(data){
	    	TeachersService.teachers = {};
	    });
	  };

	  TeachersService.addNew = function(name, email, password){
	  	return ApiService.post('teachers/create',{
	  		name : name,
	  		email : email,
	  		password : password
	  	}).success(function(data){
	  		return data;
	  	}).error(function(data){
	  		return data;
	  	});
	  };

	  return TeachersService;
	}]);
