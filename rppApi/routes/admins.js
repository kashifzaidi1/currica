var db = require('../models');
var sha1 = require('sha1');
var utils = require('../utils.js');

var localUtils = {
  commonAttributes : function(){
    return ['id','name','email','uuid','createdAt','updatedAt'];
  }
};

exports.index = function(req, res){
  db.Admins.findAll({
    attributes : localUtils.commonAttributes()
  }).success(function(admins) {
    utils.successObject(admins, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.getByID = function(req, res){
  db.Admins.find({ 
    where: { id: req.param('admin_id') } ,
    attributes : localUtils.commonAttributes()
  }).success(function(admins) {
    utils.successObject(admins, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.changePassword = function(req, res){
  db.Admins.update({
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

exports.create = function(req, res) {
  db.Admins.create({ 
  	name : req.param('name'),
    email : req.param('email'),
    password : sha1(req.param('password'))
  }).success(function(admin) {
   if(admin === null) utils.signalCustomError('Creation Failed',res);
   delete admin.dataValues.password;
   utils.successObject(admin, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.login = function(req, res) {
  db.Admins.find({ 
    where : {
      email : req.param('email'),
      password : sha1(req.param('password'))
    },
    attributes : localUtils.commonAttributes()
  }).success(function(admin) {
    if(admin === null) utils.signalCustomError('Login Failed',res);
    utils.successObject(admin, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.delete = function(req, res){
 db.Admins.destroy({
    id : req.param('admin_id')
  }).success(function(u) {
   utils.successObject({deleted : true}, res);
 }).error(function(err){
   utils.signalError(err, res);
 })
}