
'use strict';

angular.module('rppFrontEnd')
  .factory('TaskService', ['ApiService', function(ApiService) {
	  var TaskService = {};
	  TaskService.tasks = {};

	  TaskService.getAll = function() {
	    return ApiService.get('tasks', {}).success(function(data){
	      TaskService.tasks = data;
	    }).error(function(data){
	    	TaskService.tasks = {};
	    });
	  };

	  TaskService.create = function(name, link, description, taskSequenceNumber, sessionID){
	  	return ApiService.post('Tasks/create',{
	  		name : name,
	  		link : link,
	  		description: description,
	  		taskSequenceNumber: taskSequenceNumber,
	  		sessionID: sessionID
	  	}).success(function(data){
	  		return data;
	  	}).error(function(err){
	  		return err;
	  	})
	  };

	  TaskService.remove = function(taskID){
	  	return ApiService.post('Tasks/delete', {
	  		taskID : taskID
	  	}).success(function(data){
	  		return data;
	  	}).error(function(data){
	  		return data;
	  	})
	  };

	  TaskService.getLastSubmittedTaskID = function(studentID){
	  	return ApiService.post('submittedTasks/getLastSubmittedTaskByUser',{
	  		studentID : studentID
	  	}).success(function(data){
	  		return data;
	  	}).error(function(data){
	  		return data;
	  	});
	  };

	  TaskService.getUngradedTasksGroupsByClass = function(classID){
	  	return ApiService.post('submittedTasks/getUngradedTasksGroupsByClass',{
	  		classID : classID
	  	}).success(function(data){
	  		return data;
	  	}).error(function(data){
	  		return data;
	  	});
	  };

	  TaskService.getUngradedTasksByClassAndTask = function(classID, taskID){
	  	return ApiService.post('submittedTasks/getUngradedTasksByClassAndTask',{
	  		classID : classID,
	  		taskID : taskID
	  	}).success(function(data){
	  		return data;
	  	}).error(function(data){
	  		return data;
	  	});
	  };

	  TaskService.startTask = function(taskID, studentID){
	  	return ApiService.post('submittedTasks/create',{
	  		studentID: studentID,
	  		taskID : taskID
	  	}).success(function(data){
	  		return data;
	  	}).error(function(data){
	  		return data;
	  	});
	  };

	  TaskService.gradeTask = function(taskSubmissionID, comment, score, teacherID){
	  	return ApiService.post('submittedTasks/grade',{
	  		taskID : taskSubmissionID,
	  		teacherID : teacherID,
	  		gradeQuantity : score,
	  		gradeQuality : comment
	  	}).success(function(data){
	  		return data;
	  	}).error(function(data){
	  		return data;
	  	});
	  };

	  TaskService.getTimeReport = function(studentID){
	  	return ApiService.post('submittedTasks/getTimeReportForStudent',{
	  		studentID: studentID
	  	}).success(function(data){
	  		return data;
	  	}).error(function(data){
	  		return data;
	  	});
	  };

	  TaskService.getGradeReport = function(studentID){
	  	return ApiService.post('submittedTasks/getGradeReportForStudent',{
	  		studentID: studentID
	  	}).success(function(data){
	  		return data;
	  	}).error(function(data){
	  		return data;
	  	});
	  };
	  
	  TaskService.leaderBoard = function(studentID, pathID){
	  	return ApiService.post('submittedTasks/leaderBoard',{
	  		studentID: studentID,
	  		pathID : pathID
	  	}).success(function(data){
	  		return data;
	  	}).error(function(data){
	  		return data;
	  	});
	  }

	  return TaskService;
	}]);
