
'use strict';

angular.module('rppFrontEnd')
  .factory('SessionService', ['ApiService', function(ApiService) {
	  var SessionService = {};
	  SessionService.sessions = {};

	  SessionService.getAll = function() {
	    return ApiService.get('sessions', {}).success(function(data){
	      SessionService.sessions = data;
	    }).error(function(data){
	    	SessionService.sessions = {};
	    });
	  };

	  SessionService.addNewSession = function(pathID, name, description){
	  	return ApiService.post('sessions/create', {
	  		pathID : pathID,
	  		name : name,
	  		description : description
	  	}).success(function(data){
	  		return data;
	  	}).error(function(data){
	  		return data;
	  	});
	  };

	  SessionService.getSessionBySessionID = function(sessionID) {
	    return ApiService.get('sessions/'+sessionID, {});
	  };

	  SessionService.getSessionByPathID = function(pathID) {
	    return ApiService.get('sessions/getSessionByPathID/'+pathID, {
	    	pathID : pathID
	    }).success(function(data){
	      SessionService.sessions = data;
	      return data;
	    }).error(function(data){
	    	SessionService.sessions = {};
	    });
	  };

	  SessionService.getSessionTasksByStudent = function(sessionID, studentID, pathID){
	  	return ApiService.post('Sessions/getTasksForUserByStudentIDAndSessionID', {
	  		sessionID : sessionID,
	  		studentID : studentID,
	  		pathID : pathID
	  	}).success(function(data){
	  		return data;
	  	}).error(function(data){
	  		return data;
	  	})
	  }

	  SessionService.getNextSessionInPath = function(studentID, pathID){
	  	return ApiService.post('Sessions/getNextSessionInPath',{
	  		studentID : studentID,
	  		pathID : pathID
	  	}).success(function(data){
	  		return data;
	  	}).error(function(data){
	  		return data;
	  	});
	  }

	  SessionService.getSessionByTaskID = function(taskID) {
	    return ApiService.post('Sessions/getSessionByTaskId/', {
	    	taskID : taskID
	    })
	  };

	  SessionService.getFirstSessionInPathForStudent = function(studentID, pathID){
	  	return ApiService.post('Sessions/getFirstSessionInPath', {
	  		studentID : studentID,
	  		pathID : pathID
	  	}).success(function(data){
	  		return data;
	  	}).error(function(data){
	  		return data;
	  	});
	  };

	  SessionService.remove = function(sessionID){
	  	return ApiService.post('Sessions/delete', {
	  		session_id : sessionID
	  	}).success(function(data){
	  		return data;
	  	}).error(function(data){
	  		return data;
	  	})
	  };


	  return SessionService;
	}]);
