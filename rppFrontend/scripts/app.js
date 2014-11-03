'use strict';

angular.module('rppFrontEnd', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngAnimate',
  'angularFileUpload',
  'ngStorage'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/paths', {
        templateUrl: 'views/paths.html',
        controller: 'PathsCtrl'
      })
      .when('/studentTasks', {
        templateUrl: 'views/studentTasks.html',
        controller: 'StudentTasksCtrl'
      })
      .when('/sessions', {
        templateUrl: 'views/sessions.html',
        controller: 'SessionsCtrl'
      })
      .when('/sessions/:path', {
        templateUrl: 'views/sessions.html',
        controller: 'SessionsCtrl'
      })
      .when('/studentOverview', {
        templateUrl: 'views/studentOverview.html',
        controller: 'StudentOverview'
      })
      .when('/classes', {
        templateUrl: 'views/classes.html',
        controller: 'ClassesCtrl'
      })
      .when('/student/:student', {
        templateUrl: 'views/student.html',
        controller: 'StudentCtrl'
      })
      .when('/studentTimeReport/:student', {
        templateUrl: 'views/studentTimeReport.html',
        controller: 'StudentTimeReportCtrl'
      })
      .when('/studentGradesReport/:student', {
        templateUrl: 'views/studentGradesReport.html',
        controller: 'StudentGradesReportCtrl'
      })
      .when('/ungradedTasks/:classID', {
        templateUrl: 'views/ungradedTasks.html',
        controller: 'UngradedTasksCtrl'
      })
      .when('/gradeStudents/class/:classID/task/:taskID', {
        templateUrl: 'views/gradeStudents.html',
        controller: 'GradeStudentsCtrl'
      })
      .when('/attendance', {
        templateUrl: 'views/attendance.html',
        controller: 'AttendanceCtrl'
      })
      .when('/admin', {
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function ($rootScope, $timeout, $window) {
    $rootScope.$on('$routeChangeStart', function () {
      $window.$('#main-view').css('display', 'none');
    });
    $rootScope.$on('$routeChangeSuccess', function () {
      $window.scrollTo(0,0);
      $window.$('#main-view').css('display', 'block');
    });
  });


