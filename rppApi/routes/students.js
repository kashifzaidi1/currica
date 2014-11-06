var db = require('../models');
var sha1 = require('sha1');
var utils = require('../utils.js');

var localUtils = {
  commonAttributes : function(){
    return ['id','name','email','uuid','createdAt','updatedAt'];
  }
};

exports.index = function(req, res){
  db.Students.findAll({
    attributes : localUtils.commonAttributes()
  }).success(function(students) {
    utils.successObject(students, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.changePassword = function(req, res){
  db.Students.update({
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
  db.Students.find({ 
    where: { id: req.param('student_id')},
    attributes : localUtils.commonAttributes()
  }).success(function(student) {
    utils.successObject(student, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.getStudentDetails = function(req, res){
  var query = 'SELECT stu.id, stu.name, stu.email, cla.name AS className '
  +'FROM  `Students` stu,  `ClassStudents` cls,  `Classes` cla '
  +'WHERE stu.id = cls.StudentId '
  +'AND cla.id = cls.ClassId '
  +'AND stu.id = '+req.param('student_id') ;

  sequelize.query(query,null,{raw:true}).success(function(data){
    utils.successObject(data, res);
  }).error(function(){
    utils.signalCustomError('Not found!',res);
  });
}

exports.getStudentProgress = function(req, res){
  var query = 'SELECT ( '
    +' SELECT COUNT( s.id ) '
    +' FROM  `Tasks` t,  `Sessions` s '
    +' WHERE s.id = t.SessionId '
    +' AND s.PathID =  '+req.param('pathID')
    +' ) AS total, ( '
    +' SELECT COUNT( st.id ) '
    +' FROM  `SubmittedTasks` st,  `Tasks` t,  `Sessions` s,  `Paths` p '
    +' WHERE St.StudentID =  '+req.param('student_id')+' '
    +' AND t.id = st.TaskID '
    +' AND s.id = t.SessionID '
    +' AND s.PathId = p.id '
    +' AND p.id = '+req.param('pathID')+' '
    +' ) AS completed';

  sequelize.query(query,null,{raw:true}).success(function(data){
    // calculate progress
    data[0]["progress"]= (data[0].completed / data[0].total * 100).toFixed(2);
    data[0]["progress"] = isNaN(data[0]["progress"])? 0 : data[0]["progress"];
    utils.successObject(data, res);
  }).error(function(err){
    utils.signalError(err, res);
    utils.signalCustomError('Not found!',res);
  });
}



exports.create = function(req, res) {
  db.Paths.find({
    where : {
      id : req.param('pathID')
    }
  }).success(function(path){
    db.Students.create({ 
      name : req.param('name'),
      email : req.param('email'),
      password : sha1(req.param('password'))
    }).success(function(student) {
     if(student === null) utils.signalCustomError('Creation Failed',res);
     // Add initial Path
     db.StudentPaths.create({}).success(function(studentPath){
      
      studentPath.setStudent(student);
      studentPath.setPath(path);
      delete student.dataValues.password;
      utils.successObject(student, res);
     }).error(function(err){
      
      delete student.dataValues.password;
      utils.successObject(student, res);
     });
     
    }).error(function(err){
      utils.signalError(err, res);
    })
  }).error(function(err){
    utils.signalError(err, res);
  });
}

exports.login = function(req, res) {
  db.Students.find({ 
    where : {
      email : req.param('email'),
      password : sha1(req.param('password'))
    },
    attributes : localUtils.commonAttributes()
  }).success(function(student) {
    if(student == null || student.dataValues == null || student.dataValues.id == null) 
      utils.signalCustomError('Login Failed',res);
    else {
      db.StudentPaths.findAll({ where : { studentID : student.dataValues.id }, include: [ db.Paths ]
      }).success(function(studentPaths){
        var stObj = JSON.parse(JSON.stringify(student));
        stObj.paths = JSON.parse(JSON.stringify(studentPaths));
        utils.successObject(stObj, res);
      }).error(function(err){
        utils.successObject(student, res);
      })
    }
  }).error(function(err){
    utils.signalError(err, res);
  })
}