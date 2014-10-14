var db = require('../models')
var utils = require('../utils.js');

exports.index = function(req, res){
  var date = new Date();
  db.Attendance.findAll().success(function(attendance) {
    utils.successObject(attendance, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.getAttendanceByStudent = function(req, res){
  db.Attendance.find({
  	where : {
  		StudentId : req.param('studentID')
  	}
  }).success(function(attendance) {
    utils.successObject(attendance, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.create = function(req, res) {
  var query = 'SELECT count(*) as count '
    +' FROM Attendances '
    +' WHERE DATE( createdAt ) = CURDATE( ) and studentId = '+ req.param('studentID')+';'
    sequelize.query(query,null,{raw:true}).success(function(count){
      if(count.length>0 && count[0].count == 0){
        db.Students.find({ where: { id: req.param('studentID') } }).success(function(Student) {
          db.Attendance.create({}).success(function(attendance) {
            attendance.setStudent(Student);
            utils.successObject(attendance, res);
          }).error(function(err){
              utils.successObject({}, res);
          })
        }).error(function(err){
          utils.successObject({}, res);
        })
      } else {
        utils.successObject({}, res);
      }
    }).error(function(){
      utils.successObject({}, res);
    });
	
}

exports.getAttendanceForDay = function(req, res){
  var query = 'SELECT s.id, s.name, s.email, ('
    + ' CASE WHEN EXISTS ( '
    + ' SELECT *  '
    + ' FROM attendances a '
    + ' WHERE s.id = a.StudentId '
    + " AND DATE( a.createdAt ) = date('"+req.param('date')+"') "
    + ' ) '
    + ' THEN TRUE ELSE FALSE END '
    + ' ) AS Present '
    + ' FROM Students s, classStudents c '
    + ' WHERE s.id = c.StudentId '
    + ' AND c.classId = '+req.param('classID')+' ;'

    sequelize.query(query, null, {raw:true}).success(function(result){
      utils.successObject(result, res);
    }).error(function(err){
      utils.signalError(err, res);
    });

}

