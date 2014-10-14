
'use strict';

angular.module('rppFrontEnd')
  .factory('AdminsService', ['ApiService', function(ApiService) {
	  var AdminsService = {};
	  AdminsService.admins = {};

	  AdminsService.getAll = function() {
	    return ApiService.get('admins', {}).success(function(data){
	      AdminsService.admins = data;
	    }).error(function(data){
	    	AdminsService.admins = {};
	    });
	  };

	  AdminsService.addNew = function(name, email, password){
	  	return ApiService.post('admins/create',{
	  		name : name,
	  		email : email,
	  		password : password
	  	}).success(function(data){
	  		return data;
	  	}).error(function(data){
	  		return data;
	  	});
	  };

	  AdminsService.getAttendanceForDay = function(isoDate, classID){
	  	return ApiService.post('Attendance/getAttendanceForDay',{
	  		date:isoDate,
	  		classID:classID
	  	}).success(function(data){
	  		return data;
	  	}).error(function(data){
	  		return data;
	  	});
	  };

	  return AdminsService;
	}]);
