var db = require('../models')
var utils = require('../utils.js');

 
exports.index = function(req, res){
  db.Tasks.findAll().success(function(tasks) {
    utils.successObject(tasks, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.getByID = function(req, res){
  db.Tasks.find({ where: { id: req.param('task_id') } }).success(function(task) {
    utils.successObject(task, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.getTaskBySessionID = function(req, res){
  db.Tasks.find({ where: { sessionId: req.param('sessionID') } }).success(function(task) {
    utils.successObject(task, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.create = function(req, res) {
  db.Sessions.find({ where: { id: req.param('sessionID') } }).success(function(session) {
     db.Tasks.create({ 
      name : req.param('name'),
       link : req.param('link'),
       description : req.param('description'),
       taskSequenceNumber : req.param('taskSequenceNumber')
     }).success(function(task) {
        task.setSession(session);
        utils.successObject(task, res);
     }).error(function(err){
       utils.signalError(err, res);
     })
   }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.delete = function(req, res){
 db.Tasks.destroy({
    id : req.param('taskID')
  }).success(function(u) {
   utils.successObject({deleted : true}, res);
 }).error(function(err){
   utils.signalError(err, res);
 })
}