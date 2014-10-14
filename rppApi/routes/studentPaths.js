var db = require('../models')
var utils = require('../utils.js');

exports.index = function(req, res){
  db.StudentPaths.findAll({
    include: [ db.Students, db.Paths ]
  }).success(function(studentPaths) {
    utils.successObject(studentPaths, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.getByPath = function(req, res){
  db.StudentPaths.findAll({ where: { pathID: req.param('pathID') }, include: [ db.Students, db.Paths ]
  }).success(function(studentPaths) {
    utils.successObject(studentPaths, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.getPathsByStudentID = function(req, res){
  db.StudentPaths.findAll({ where: { studentID: req.param('studentID') }, include: [ db.Paths ]
  }).success(function(studentPaths) {
    utils.successObject(studentPaths, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.create = function(req, res) {
  db.StudentPaths.findOrCreate({
    pathID : req.param('pathID'),
    studentID : req.param('studentID')
  }).success(function(studentPath, created){
    if(created) {
      db.Paths.find({ where: { id: req.param('pathID') } }).success(function(ppath) {
        db.Students.find({ where: { id: req.param('studentID') } }).success(function(student) {
          studentPath.setPath(ppath);
          studentPath.setStudent(student);
          utils.successObject(studentPath, res);
        }).error(function(err){
          utils.signalError(err, res);
        })
      }).error(function(err){
        utils.signalError(err, res);
      });
    }
    else utils.signalCustomError("Already Added", res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.delete = function(req, res){
 db.StudentPaths.destroy({
    pathID : req.param('pathID'),
    studentID : req.param('studentID')
  }).success(function(u) {
   utils.successObject({deleted : true}, res);
 }).error(function(err){
   utils.signalError(err, res);
 })
}

