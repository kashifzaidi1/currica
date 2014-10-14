
'use strict';
// interceptor service which can be used to control the requests
angular.module('rppFrontEnd')
  .factory('PathService', ['ApiService', function(ApiService) {
	  var PathService = {};
	  PathService.path = {};

	  PathService.getAll = function() {
	    return ApiService.get('paths', {}).success(function(data){
	      PathService.path = data;
	    }).error(function(data){
	    	PathService.path = {};
	    });
	  };

	  PathService.getPathsByStudentID = function(studentID){
	  	return ApiService.post('paths/getPathsByStudentID', {
	  		studentID : studentID
	  	}).success(function(data){
	  	  PathService.path = data;
	  	}).error(function(data){
	  		PathService.path = {};
	  	});
	  };

	  PathService.addNew = function(pathName){
	  	return ApiService.post('paths/create',{
	  		name : pathName
	  	}).success(function(data){
	  		return data;
	  	}).error(function(data){
	  		return data;
	  	});
	  };

	  PathService.addStudentToPath = function(studentID, pathID){
	  	return ApiService.post('StudentPaths/create',{
	  		studentID : studentID,
	  		pathID : pathID
	  	}).success(function(data){
	  		return data;
	  	}).error(function(data){
	  		return data;
	  	});
	  };

	  return PathService;
	}]);
