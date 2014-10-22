var db = require('../models');
var fs = require('fs');
var utils = require('../utils.js');


 
exports.index = function(req, res){
  db.SubmittedTasks.findAll().success(function(submittedTasks) {
    utils.successObject(submittedTasks, res);
  }).error(function(err){
    utils.signalError(err, res);
  });
};

exports.getByID = function(req, res){
  db.SubmittedTasks.find({ 
    where: { 
      id: req.param('submission_id') 
    },
    include : [db.Tasks] 
  }).success(function(submittedTasks) {
    utils.successObject(submittedTasks, res);
  }).error(function(err){
    utils.signalError(err, res);
  });
};

exports.getUngradedTasksByTaskID = function(req, res){
  db.SubmittedTasks.find({ 
    where: { 
        taskId: req.param('taskID'), 
        isSubmitted : false,
        isGraded : false
      } 
    }).success(function(submittedTasks) {
      if(submittedTasks === null) utils.successObject({message : "empty", count: 0}, res);
      utils.successObject(submittedTasks, res);
    }).error(function(err){
      utils.signalError(err, res);
  });
};

var updateCompletedSessions = function(taskID, studentID, sessionID, task, res){
  var completedQuery = 'SELECT count(*) AS count FROM `SubmittedTasks` s, `Tasks` t '
    + ' WHERE s.studentID = '+studentID+' AND s.taskId = t.id  AND s.isSubmitted = true '
    + ' AND t.sessionId = (SELECT sessionId FROM Tasks WHERE id = '+taskID+')';
    sequelize.query(completedQuery,null,{raw:true}).success(function(completedCount){
      if(completedCount.length > 0){
        var totalQuery = 'SELECT count(*) AS count FROM Tasks t '
          +' WHERE t.sessionId = (SELECT sessionId FROM Tasks WHERE id = '+taskID+')';
          sequelize.query(totalQuery,null,{raw:true}).success(function(totalCount){
            if(totalCount.length > 0 && totalCount[0].count == completedCount[0].count){
              var date = new Date();
              var query = "INSERT INTO `CompletedSessions` (SessionId, StudentId, createdAt, updatedAt) "
              + " VALUES ("+sessionID+","+studentID+",'"+date.toISOString()+"','"+date.toISOString()+"');"
              sequelize.query(query, null,{raw:true}).success(function(){
                task["sessionFinished"]= true;
                utils.successObject(task, res);
              }).error(function(){
                utils.successObject(task, res);
              })
            } else{
              utils.successObject(task, res);  
            }
          }).error(function(err){
            utils.successObject(task, res);
          });
      } else {
        utils.successObject(task, res);
      }
    }).error(function(err){
      utils.successObject(task, res);
    }); 
}

var updateTask = function(submittedFile, req, res){

  db.SubmittedTasks.update({ 
    endTime : new Date().toISOString(),
    submittedFile : submittedFile,
    submittedComment : req.body.submittedComment,
    isSubmitted : true
    },{ 
      taskId : req.body.taskID,
      studentId : req.body.studentID
  }).success(function(task) {
    task = {completed : task, sessionFinished :false };
    updateCompletedSessions(req.body.taskID, req.body.studentID, req.body.sessionID, task, res);
  }).error(function(err){
    utils.signalError(err, res);
  });
};

exports.getLastSubmittedTaskByUser = function(req, res){
  sequelize.query("SELECT * FROM `submittedTasks` WHERE StudentID = "+req.param('studentID')+
   " and endTime = (SELECT MAX(endTime) FROM `submittedTasks` WHERE studentID = "+req.param('studentID')+");",db.submittedTasks,{raw:true}).success(function(submittedTask){
    if(submittedTask.length > 0){
      utils.successObject(submittedTask[0], res);
    }
    else {
      utils.signalCustomError("No Records", res);
    }
  }).error(function(){
    utils.signalCustomError("No Records", res);
  })
}

exports.submitTaskFromStudent = function(req, res){
  if(typeof req.files['file'] !== "undefined"){
    var newFilePath =  __dirname + '/../uploads/' + Math.random().toString(36).slice(2) + req.files.file.originalFilename;
    fs.rename(req.files.file.path, newFilePath, function(err){
      if(!err) updateTask(newFilePath, req, res);
    });
  } else {
    updateTask(null, req, res);
  }
};

exports.getUngradedTasksByClassAndTask = function(req, res){
  var query = 'SELECT tsks.id as taskID, t.id , t.submittedFile, t.submittedComment, tsks.name , stu.name AS studentName, '+
  ' stu.id as studentID, tsks.description, tsks.link  FROM `SubmittedTasks` t, `ClassStudents` s, `Tasks` tsks, `Students` stu '+
  'WHERE t.StudentId = s.Studentid and tsks.id = t.taskID and t.StudentId = stu.id and '+
  'classId = '+req.param('classID')+' and t.taskID = '+req.param('taskID')+' and t.isGraded = false '+
  'and t.isSubmitted = true;';

  sequelize.query(query,null,{raw:true}).success(function(data){
    if(data.length > 0) 
      utils.successObject(data, res);
    else
      utils.signalCustomError("No Records", res);
  }).error(function(err){
    utils.signalCustomError("No Records", res);
  });


};

exports.getTimeReportForStudent = function(req, res){
  db.SubmittedTasks.findAll({ 
    where: { 
      studentID : req.param('studentID'),
      isSubmitted : true
    },
    include : [db.Tasks, db.Students] 
  }).success(function(submittedTasks) {
    utils.successObject(submittedTasks, res);
  }).error(function(err){
    utils.signalError(err, res);
  });
};

exports.getGradeReportForStudent = function(req, res){
  db.SubmittedTasks.findAll({ 
    where: { 
      studentID : req.param('studentID'),
      isGraded : true
    },
    include : [db.Tasks, db.Students, db.Teachers] 
  }).success(function(submittedTasks) {
    utils.successObject(submittedTasks, res);
  }).error(function(err){
    utils.signalError(err, res);
  });
};

exports.getUngradedTasksGroupsByClass = function(req, res){

  sequelize.query("SELECT distinct(t.taskID), tsks.name, c.name as className FROM `SubmittedTasks` t, `ClassStudents` s, `Tasks` tsks, `Classes` c "+
    " WHERE t.StudentId = s.Studentid and tsks.id = t.taskID and s.classId = c.id and s.classId = "+req.param('classID')+" and t.isGraded = false and t.isSubmitted = true; ", null, {raw:true}).success(function(data){
        if(data.length > 0) 
          utils.successObject(data, res);
        else
          utils.signalCustomError("No Records", res);
    }).error(function(){
      utils.signalCustomError("No Records", res);
    });
};

exports.teacherHasGraded = function(req, res){
    db.SubmittedTasks.update({ 
      gradeQuantity : req.param('gradeQuantity'),
      gradeQuality : req.param('gradeQuality'),
      isGraded : true,
    },{ id : req.param('taskID') }).success(function(submittedTask) {
      sequelize.query('UPDATE SubmittedTasks set TeacherId = '
        +req.param('teacherID') +
        ' Where id = '+req.param('taskID')+';',null,{raw:true}).then(function(success){
        utils.successObject(submittedTask, res);
      }).error(function(err){
        utils.successObject(submittedTask, res);
      })
    }).error(function(err){
        utils.signalError(err, res);
    });

};

exports.create = function(req, res) {
  db.Tasks.find({ where: { id: req.param('taskID') } }).success(function(task) {
    db.Students.find({ where: { id: req.param('studentID') } }).success(function(student) {
      db.SubmittedTasks.create({ 
        submittedFile : req.param('submittedFile'),
        submittedComment : req.param('submittedComment'),
        gradeQuantity : req.param('gradeQuantity'),
        gradeQuality : req.param('gradeQuality')
      }).success(function(submittedTask) {
       submittedTask.setTask(task);
       submittedTask.setStudent(student);
       utils.successObject(submittedTask, res);
      }).error(function(err){
        utils.signalError(err, res);
      })
    }).error(function(err){
      utils.signalError(err, res);
    })
  }).error(function(err){
    utils.signalError(err, res);
  });
};

exports.leaderBoard = function(req, res){
  var query = 'SELECT s.studentId, c.classId, st.name, COUNT( * ) AS completed, ( '
    +' SELECT COUNT( * ) '
    +' FROM Tasks t, Paths p, Sessions s '
    +' WHERE p.id = '+req.param('pathID')+'  '
    +' AND t.SessionId = s.id '
    +' AND p.id = s.PathId '
    +' ) AS total '
    +' FROM SubmittedTasks s, ClassStudents c, students st, Tasks tks, Sessions ss '
    +' WHERE c.StudentId = s.StudentId '
    +' AND tks.id = s.TaskId '
    +' AND ss.id = tks.SessionId '
    +' AND ss.PathId = '+req.param('pathID')+' '
    +' AND c.classId = (  '
    +' SELECT classId '
    +' FROM classStudents '
    +' WHERE StudentId = '+req.param('studentID')+' )  '
    +' AND s.isSubmitted = TRUE '
    +' AND st.id = c.StudentId '
    +' AND st.id = s.StudentId '
    +' GROUP BY s.studentId '
    +' ORDER BY completed DESC LIMIT 0 , 5 ';

    sequelize.query(query, null, {raw:true}).success(function(data){
          if(data.length > 0) {
            for(var i in data){
              data[i]["progress"] = (data[i].completed / data[i].total * 100).toFixed(2);
              data[i]["progress"] = isNaN(data[i]["progress"])? 0 : data[i]["progress"];
            }
            utils.successObject(data, res);
          }
          else
            utils.signalCustomError("No Records", res);
      }).error(function(){
        utils.signalCustomError("No Records", res);
      });
    }

exports.delete = function(req, res){
 db.submittedTasks.destroy({
    id : req.param('submittedTaskID')
  }).success(function(u) {
   utils.successObject({deleted : true}, res);
 }).error(function(err){
   utils.signalError(err, res);
 })
}