
'use strict';

angular.module('rppFrontEnd')
  .factory('ClassesService', ['ApiService', function(ApiService) {
	  var ClassesService = {};
	  ClassesService.classes = {};

	  ClassesService.getAll = function() {
	    return ApiService.get('classes', {}).success(function(data){
	      ClassesService.classes = data;
	    }).error(function(data){
	    	ClassesService.classes = {};
	    });
	  };

	  ClassesService.addNew = function(className, teacherID){
	  	return ApiService.post('classes/create',{
	  		name : className,
	  		teacherID : teacherID
	  	}).success(function(data){
	  		return data;
	  	}).error(function(data){
	  		return data;
	  	});
	  };

	  return ClassesService;
	}]);
