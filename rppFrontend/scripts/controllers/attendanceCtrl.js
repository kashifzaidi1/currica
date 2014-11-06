'use strict';

angular.module('rppFrontEnd')
.controller('AttendanceCtrl', ['$scope','$location','AdminsService','LoginService','ClassesService','$localStorage', function ($scope,$location,AdminsService,LoginService,ClassesService,$localStorage) {
	var datePickerSelector = "#sandbox-container .input-group.date";
	$scope.changeDate = function(){
		var date = moment($(datePickerSelector).datepicker('getDate'));
		AdminsService.getAttendanceForDay(moment(date).format('YYYY-MM-DD'), $scope.assignedClass).then(function(attendance){
			$scope.attendance = attendance.data;
		}).catch(function(err){
			helper.errorHandler(err,'No Attendance Records for Today');
			$scope.attendance = false;
		});
	};

	$scope.viewInit = function(){
		$(datePickerSelector).datepicker({
		    format: "dd/mm/yyyy",
		    todayBtn: "linked",
		    daysOfWeekDisabled: "0",
		    todayHighlight: true
		})
		.on('changeDate',$scope.changeDate);
	};
	
	$scope.init = function(){
		$scope.classes = {};
		$scope.assignedClass = "";
		$scope.user = $localStorage.user || LoginService.getUser();
		$scope.info = $localStorage.info || LoginService.getUserInfo();
		$scope.students = {};
		$scope.getAllClasses();
		$scope.viewInit();
	};

	$scope.getAllClasses = function(){
		ClassesService.getAll().then(function(data){
			$scope.classes = data.data;
			$scope.assignedClass = $scope.classes[0].id;
			$(datePickerSelector).datepicker('update', new Date());
			$scope.changeDate();
		}).catch(function(err){
			helper.errorHandler(err, "Please add a Class!")
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
	
}]);