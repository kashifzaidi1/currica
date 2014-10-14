
'use strict';
angular.module('rppFrontEnd')
  .factory('StudentService', ['ApiService', function(ApiService) {
	  
	  var StudentService = {};
	  StudentService.student = {};

	  StudentService.getAll = function() {
	    return ApiService.get('students', {}).success(function(data){
	      StudentService.student = data;
	    }).error(function(data){
	    	StudentService.student = {};
	    });
	  };

	  StudentService.addNew = function(pathID, name, email, password){
	  	return ApiService.post('students/create',{
	  		pathID : pathID,
	  		name : name,
	  		email : email,
	  		password : password
	  	}).success(function(data){
	  		return data;
	  	}).error(function(data){
	  		return data;
	  	});
	  };

	  StudentService.markAttendance = function(studentID){
	  	return ApiService.post('attendance/create',{
	  		studentID : studentID
	  	}).success(function(data){
	  		return data;
	  	}).error(function(data){
	  		return data;
	  	});
	  };

	  StudentService.addToClass = function(studentID, classID){
	  	return ApiService.post('ClassStudents/create',{
	  		classID : classID,
	  		studentID : studentID
	  	}).success(function(data){
	  		return data;
	  	}).error(function(data){
	  		return data;
	  	});
	  };

	  StudentService.getAllByClass = function(classID){
	  	return ApiService.get('ClassStudents/'+classID ,{
	  		class_id : classID
	  	}).success(function(data){
	  		return data;
	  	}).error(function(data){
	  		return data;
	  	});
	  };

	  StudentService.getStudentDetails = function(student_id){
	  	return ApiService.post('Students/getStudentDetails',{
	  		student_id : student_id
	  	}).success(function(data){
	  		return data;
	  	}).error(function(data){
	  		return data;
	  	});
	  };

	  StudentService.getStudentProgress = function(student_id){
	  	return ApiService.post('Students/getStudentProgress',{
	  		student_id : student_id
	  	}).success(function(data){
	  		return data;
	  	}).error(function(data){
	  		return data;
	  	});
	  };

	  return StudentService;
	}]);
