var db = require('../models')
var utils = require('../utils.js');

 
exports.index = function(req, res){
  db.Sessions.findAll({
    include: [ db.Tasks ]
  }).success(function(sessions) {
    utils.successObject(sessions, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.getByID = function(req, res){
  db.Sessions.find({ where: { id: req.param('session_id') }, include: [ db.Tasks ] }).success(function(session) {
    utils.successObject(session, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.getSessionByPathID = function(req, res){
  db.Sessions.findAll({ where: { pathId: req.param('pathID') }, include: [ db.Tasks ] }).success(function(session) {
    utils.successObject(session, res);
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.getNextSessionInPath = function(req, res){
  var query = 'select * from sessions s where s.id =  '
    +' (Select min(id) from sessions where pathID = '+req.param('pathID')+' '
    +'  and id > (SELECT Max(sessionID) FROM CompletedSessions where studentId = '+req.param('studentID')+')) '; 

  sequelize.query(query, null, {raw:true}).success(function(data){
    if(data.length > 0){
      utils.successObject(data[0], res);
    } else {
      utils.signalCustomError("No Records", res);
    }
    
  }).error(function(){
     utils.signalCustomError("No Records", res);
  });
};

exports.getFirstSessionInPath = function(req, res){
  var query = 'select * from sessions s '
    + '  where s.id =  (Select min(id) from sessions where pathID = '+req.param('pathID')+' )'

  sequelize.query(query,null,{raw:true}).success(function(session){
    if(session.length > 0){
      utils.successObject(session, res);
    }
    else {
      utils.signalCustomError("No Session Found", res);
    }
  }).error(function(){
    utils.signalCustomError("No Session Found", res);
  })
};

exports.getTasksForUserByStudentIDAndSessionID = function(req, res){
  var query = 'SELECT t.id, t.name, t.link, t.description, t.taskSequenceNumber, t.createdAt, s.id as sessionId, ( '
      + ' CASE  '
      + ' WHEN EXISTS (  SELECT *  FROM submittedTasks sut '
      + ' WHERE sut.studentID = '+req.param('studentID')+' '
      + ' AND sut.taskID = t.id AND sut.isSubmitted = TRUE  ) '
      + ' THEN TRUE ELSE FALSE END ) AS isSubmitted , ( '
      + ' CASE  '
      + ' WHEN EXISTS ( SELECT *  '
      + ' FROM submittedTasks sut '
      + ' WHERE sut.studentID = '+req.param('studentID')+' '
      + ' AND sut.taskID = t.id  ) '
      + ' THEN TRUE  ELSE FALSE  END ) AS recordExists '
      + ' FROM tasks t, sessions s '
      + ' WHERE t.SessionId = s.id '
      + ' AND s.PathId = '+req.param('pathID')+' '
      + ' AND t.sessionId = '+req.param('sessionID')+''; 

  sequelize.query(query,null,{raw:true}).success(function(session){
    if(session.length > 0){
      utils.successObject(session, res);
    }
    else {
      utils.signalCustomError("No Session Found", res);
    }
  }).error(function(){
    utils.signalCustomError("No Session Found", res);
  })
};

exports.getSessionByTaskID = function(req, res){
  sequelize.query("SELECT * from Sessions where Sessions.id = (SELECT sessionID from Tasks where Tasks.id = "+req.param('taskID')+");",db.Sessions,{raw:true}).success(function(sessions){
    if(sessions.length > 0){
      utils.successObject(sessions[0], res);
    }
    else {
      utils.signalCustomError("No Session Found", res);
    }
  }).error(function(){
    utils.signalCustomError("No Session Found", res);
  })
}

exports.create = function(req, res) {
  db.Paths.find({ where: { id: req.param('pathID') } }).success(function(path) {
    db.Sessions.create({ 
      name : req.param('name'),
      description : req.param('description')
    }).success(function(session) {
      session.setPath(path);
      utils.successObject(session, res);
    }).error(function(err){
      utils.signalError(err, res);
    })
  }).error(function(err){
    utils.signalError(err, res);
  })
}

exports.delete = function(req, res){
 db.Sessions.destroy({
    id : req.param('session_id')
  }).success(function(u) {
   utils.successObject({deleted : true}, res);
 }).error(function(err){
   utils.signalError(err, res);
 })
}