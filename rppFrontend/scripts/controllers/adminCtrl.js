'use strict';

angular.module('rppFrontEnd')
.controller('AdminCtrl', ['$scope','$location','LoginService','PathService','ClassesService','TeachersService','StudentService','AdminsService','$localStorage', function ($scope,$location,LoginService,PathService,ClassesService,TeachersService,StudentService,AdminsService,$localStorage) {

	$scope.init = function(){
		$scope.user = $localStorage.user || LoginService.getUser();
		$scope.info = $localStorage.info || LoginService.getUserInfo();
		$scope.teacherData = {
			name : "",
			email : "",
			password : ""
		};
		$scope.adminData = $scope.teacherData ;
		$scope.studentData = $scope.teacherData ;
		$scope.classname = "";
		$scope.pathways = {};
		$scope.classes = {};
		$scope.assignedClass = "";
		$scope.teachers = {};
		$scope.assignedTeacher = "";
		$scope.className = "";
		$scope.assignedPathway="";

	};

	$scope.getAllPatways = function(){
		PathService.getAll().then(function(data){
			$scope.pathways = data.data;
			$scope.assignedPathway = $scope.pathways[0].id;
		}).catch(function(err){
			helper.errorHandler(err, "Please add a Pathway!")
		});
	};

	$scope.getAllClasses = function(){
		ClassesService.getAll().then(function(data){
			$scope.classes = data.data;
			if($scope.classes.length > 0)
			$scope.assignedClass = $scope.classes[0].id;
			$scope.getStudents();
		}).catch(function(err){
			helper.errorHandler(err, "Please add a Class!")
		});
	};

	$scope.getStudents = function(){
		StudentService.getAllByClass($scope.assignedClass).then(function(data){
			$scope.students = data.data;
			$scope.assignedStudent = data.data[0].StudentId;
		}).catch(function(err){
			helper.errorHandler(err, "Failed to locate students.!");
		});
	};

	$scope.getAllTeachers = function(){
		TeachersService.getAll().then(function(data){
			$scope.teachers = data.data;
			if($scope.teachers.length > 0)
			$scope.assignedTeacher = $scope.teachers[0].id;
		}).catch(function(err){
			helper.errorHandler(err, "Please add a Teacher!");
		});
	};

	$scope.populateFields = function(){
		$scope.getAllPatways();
		$scope.getAllClasses();
		$scope.getAllTeachers();
	};

	$scope.addStudentToPathway = function(){
		if($scope.assignedStudent){
			PathService.addStudentToPath($scope.assignedStudent, $scope.assignedPathway).then(function(data){
				helper.success("Added");
				$scope.init();
				$scope.populateFields();
				helper.hideCurrentActiveModal();
			}).catch(function(err){
				helper.errorHandler(err, "Student is already in the pathway!");
			});
		} else {
			helper.error("Please Select the Student");
			helper.hideCurrentActiveModal();
		}
	};

	$scope.addStudent = function(){
		var validate = [$scope.studentData.name, $scope.studentData.email, $scope.studentData.password];
		if(helper.validateLength(validate)){
			StudentService.addNew($scope.assignedPathway, 
				$scope.studentData.name, $scope.studentData.email, $scope.studentData.password).then(function(data){
					StudentService.addToClass(data.data.id, $scope.assignedClass).then(function(data){
						helper.success("Added");
						helper.hideCurrentActiveModal();
						$scope.init();
						$scope.populateFields();
						$scope.getStudents();
					}).catch(function(error){
						helper.error("Please re-assign class");
						helper.hideCurrentActiveModal();
					});
			}).catch(function(err){
				helper.errorHandler(err, "Cannot Add a user at this time, Try again later!");
				helper.hideCurrentActiveModal();
			});
		} else {
			helper.error("Please Fill all Fields");
			helper.hideCurrentActiveModal();
		}
	};

	$scope.addAdmin = function(){
		var validate = [$scope.adminData.name, $scope.adminData.email, $scope.adminData.password];
		if(helper.validateLength(validate)){
			AdminsService.addNew($scope.adminData.name, $scope.adminData.email, 
				$scope.adminData.password).then(function(data){
				helper.success("Admin Added!");
				$scope.init();
				$scope.populateFields();
				helper.hideCurrentActiveModal();
			}).catch(function(err){
				helper.errorHandler(err, "Cannot Add a admin at this time, Try again later!");
				helper.hideCurrentActiveModal();
			});
		} else {
			helper.error("Please Fill all Fields");
			helper.hideCurrentActiveModal();
		}
	};

	$scope.addTeacher = function(){
		var validate = [$scope.teacherData.name, $scope.teacherData.email, $scope.teacherData.password];
		if(helper.validateLength(validate)){
			TeachersService.addNew($scope.teacherData.name, $scope.teacherData.email, 
				$scope.teacherData.password).then(function(data){
				helper.success("Teacher Added!");
				$scope.init();
				$scope.populateFields();
				helper.hideCurrentActiveModal();
			}).catch(function(err){
				helper.errorHandler(err, "Cannot Add a teacher at this time, Try again later!");
				helper.hideCurrentActiveModal();
			});
		} else {
			helper.error("Please Fill all Fields");
			helper.hideCurrentActiveModal();
		}
	};

	$scope.addClass= function(){
		if($scope.className.length > 0 &&
			$scope.assignedTeacher !== ""){
			ClassesService.addNew($scope.className, $scope.assignedTeacher).then(function(data){
				helper.success("Class Added!");
				$scope.init();
				$scope.populateFields();
				helper.hideCurrentActiveModal();
			}).catch(function(err){
				helper.errorHandler(err, "Cannot Add a Class at this time, Try again later!");
				helper.hideCurrentActiveModal();
			});
		} else {
			helper.error("Please Fill all Fields");
			helper.hideCurrentActiveModal();
		}
	};

	$scope.logout = function(){
		LoginService.logout();
		helper.success("Logged out!");
		$localStorage.$reset();
		$location.path('/');
		if(!$scope.$$phase) $scope.$apply()
	};

	$scope.init();
	$scope.populateFields();

}]);