var db = require('../models')
var utils = require('../utils.js');

var localUtils = {
  
};
 
exports.index = function(req, res){
  db.Paths.findAll({
    include: [ db.Sessions ]
  }).success(function(paths) {
   utils.successObject(paths, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.getByID = function(req, res){
  db.Paths.find({ 
    where: { id: req.param('path_id') }, 
    include: [ db.Sessions ] 
  }).success(function(paths) {
    utils.successObject(paths, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.create = function(req, res) {
  db.Paths.create({ 
  	name : req.param('name')
  }).success(function(path) {
   utils.successObject(path, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.delete = function(req, res){
 db.Paths.destroy({
    id : req.param('path_id')
  }).success(function(u) {
   utils.successObject({deleted : true}, res);
 }).error(function(err){
   utils.signalError(err, res);
 })
}