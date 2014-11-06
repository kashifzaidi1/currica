var db = require('../models')
var utils = require('../utils.js');

exports.index = function(req, res){
  db.ClassStudents.findAll({
    include: [ db.Students, db.Classes ]
  }).success(function(classStudents) {
    utils.successObject(classStudents, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.getByID = function(req, res){
  db.ClassStudents.findAll({ where: { classID: req.param('class_id') }, include: [ db.Students, db.Classes ]
  }).success(function(classStudents) {
    utils.successObject(classStudents, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.getClassByStudentID = function(req, res){
  db.ClassStudents.find({ where: { studentID: req.param('student_id') }, include: [ db.Classes ]
  }).success(function(classStudents) {
    utils.successObject(classStudents, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.create = function(req, res) {
  db.Classes.find({ where: { id: req.param('classID') } }).success(function(cclass) {
    db.Students.find({ where: { id: req.param('studentID') } }).success(function(student) {
      db.ClassStudents.create({}).success(function(classStudent) {
       classStudent.setClass(cclass);
       classStudent.setStudent(student);
       utils.successObject(classStudent, res);
      }).error(function(err){
      utils.signalError(err, res);
    })
      }).error(function(err){
      utils.signalError(err, res);
    })  
  }).error(function(err){
    utils.signalError(err, res);
  })  
}

exports.delete = function(req, res){
 db.ClassStudents.destroy({
    classID : req.param('classID'),
    studentID : req.param('studentID')
  }).success(function(u) {
   utils.successObject({deleted : true}, res);
 }).error(function(err){
   utils.signalError(err, res);
 })
}

