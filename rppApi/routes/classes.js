var db = require('../models')
var utils = require('../utils.js');

exports.index = function(req, res){
  db.Classes.findAll().success(function(classes) {
    utils.successObject(classes, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.getByID = function(req, res){
  db.Classes.find({ where: { id: req.param('class_id') } }).success(function(classes) {
    utils.successObject(classes, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.create = function(req, res) {
  db.Teachers.find({ 
      where: { id: req.param('teacherID') } 
    }).success(function(Teacher) {
    db.Classes.create({ 
      name : req.param('name')
    }).success(function(Class) {
      Class.setTeacher(Teacher);
      exports.index(req,res);
    }).error(function(err){
      utils.signalError(err, res);
    })
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.delete = function(req, res){
 db.Classes.destroy({
    id : req.param('class_id')
  }).success(function(u) {
   utils.successObject({deleted : true}, res);
 }).error(function(err){
   utils.signalError(err, res);
 })
}