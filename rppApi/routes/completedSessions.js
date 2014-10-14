var db = require('../models')
var utils = require('../utils.js');

exports.index = function(req, res){
  db.CompletedSessions.findAll({
    include: [ db.Sessions, db.Students ]
  }).success(function(completedSessions) {
    utils.successObject(completedSessions, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.getCompletedByStudentID = function(req, res){
  db.CompletedSessions.findAll({ where: { studentId: req.param('studentID') }, include: [ db.Students, db.Sessions ]
  }).success(function(completedSessions) {
    utils.successObject(completedSessions, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.delete = function(req, res){
 db.CompletedSessions.destroy({
    sessionID : req.param('sessionID'),
    studentID : req.param('studentID')
  }).success(function(u) {
   utils.successObject({deleted : true}, res);
 }).error(function(err){
   utils.signalError(err, res);
 })
}

