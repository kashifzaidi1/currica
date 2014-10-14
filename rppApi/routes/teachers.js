var db = require('../models');
var sha1 = require('sha1');
var utils = require('../utils.js');

var localUtils = {
  commonAttributes : function(){
    return ['id','name','email','uuid','createdAt','updatedAt'];
  }
};

exports.index = function(req, res){
  db.Teachers.findAll({
    include : [db.Classes],
    attributes : localUtils.commonAttributes()
  }).success(function(teachers) {
    utils.successObject(teachers, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.changePassword = function(req, res){
  db.Teachers.update({
    password : sha1(req.param('newPassword'))
  }, {
    email : req.param('email'),
    password : sha1(req.param('oldPassword'))
  }).success(function(success){
    if(success) utils.successObject({PasswordChanged : true}, res);
    else utils.signalCustomError("Failure", res);
  }).error(function(err){
    utils.signalCustomError(err, res);
  });
}

exports.getByID = function(req, res){
  db.Teachers.find({ 
    where: { id: req.param('teacher_id') } ,
    attributes : localUtils.commonAttributes()
  }).success(function(teachers) {
    utils.successObject(teachers, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.create = function(req, res) {
  db.Teachers.create({ 
  	name : req.param('name'),
    email : req.param('email'),
    password : sha1(req.param('password'))
  }).success(function(teacher) {
    if(teacher === null) utils.signalCustomError('Creation Failed',res);
    delete teacher.dataValues.password;
    utils.successObject(teacher, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.login = function(req, res) {
  db.Teachers.find({ 
    where : {
      email : req.param('email'),
      password : sha1(req.param('password'))
    },
    attributes : localUtils.commonAttributes()
  }).success(function(teacher) {
    if(teacher === null) utils.signalCustomError('Login Failed',res);
    utils.successObject(teacher, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}