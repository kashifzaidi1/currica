var express         = require('express')
  , routes          = require('./routes')
  , http            = require('http')
  , path            = require('path')
  , db              = require('./models')
  , admins          = require('./routes/admins')
  , students        = require('./routes/students')
  , teachers        = require('./routes/teachers')
  , paths           = require('./routes/paths')
  , tasks           = require('./routes/task')
  , sessions        = require('./routes/session')
  , classes         = require('./routes/classes')
  , classStudents   = require('./routes/classStudents')
  , Attendance      = require('./routes/attendance')
  , submittedTasks  = require('./routes/submittedTasks')
  , studentPaths    = require('./routes/studentPaths')
  , index           = require('./routes/index')
  , completedSessions           = require('./routes/completedSessions')
 
var app = express()
 
// all environments
app.set('port', process.env.PORT || 3000)
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.favicon())
app.use(express.bodyParser());
app.use(express.logger('dev'))
app.use(express.json())
app.use(express.urlencoded())
app.use(express.methodOverride())
app.use(app.router)
app.use(express.static(path.join(__dirname, 'public')))
 
// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler())
}

// CORS
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Origin", "http://0.0.0.0:5000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
  console.log("method is : ",req.method);
  next();
 });

// Admins
app.get('/Admins', admins.index)
app.get('/Admins/:admin_id', admins.getByID)
app.post('/Admins/create', admins.create)
app.post('/Admins/login', admins.login)
app.post('/Admins/delete', admins.delete)
app.post('/Admins/changePassword', admins.changePassword)
 
// Students
app.get('/Students', students.index)
app.get('/Students/:student_id', students.getByID)
app.post('/Students/create', students.create)
app.post('/Students/login', students.login)
app.post('/Students/changePassword', students.changePassword)
app.post('/Students/getStudentDetails', students.getStudentDetails)
app.post('/Students/getStudentProgress', students.getStudentProgress)

// Teachers
app.get('/Teachers', teachers.index)
app.get('/Teachers/:teacher_id', teachers.getByID)
app.post('/Teachers/create', teachers.create)
app.post('/Teachers/login', teachers.login)
app.post('/Teachers/changePassword', teachers.changePassword)

// Paths
app.get('/Paths', paths.index)
app.get('/Paths/:path_id', paths.getByID)
app.post('/Paths/create', paths.create)
app.post('/Paths/delete', paths.delete)

// Task
app.get('/Tasks', tasks.index)
app.get('/Tasks/:task_id', tasks.getByID)
app.post('/Tasks/create', tasks.create)
app.post('/Tasks/delete', tasks.delete)
app.get('/Tasks/getTaskBySessionID/:sessionID', tasks.getTaskBySessionID)
 
// Session
app.get('/Sessions', sessions.index)
app.get('/Sessions/:session_id', sessions.getByID)
app.post('/Sessions/create', sessions.create)
app.post('/Sessions/delete', sessions.delete)
app.get('/Sessions/getSessionByPathID/:pathID', sessions.getSessionByPathID)
app.post('/Sessions/getSessionByTaskID',sessions.getSessionByTaskID)
app.post('/Sessions/getTasksForUserByStudentIDAndSessionID', sessions.getTasksForUserByStudentIDAndSessionID)
app.post('/Sessions/getNextSessionInPath', sessions.getNextSessionInPath)
app.post('/Sessions/getFirstSessionInPath', sessions.getFirstSessionInPath);
 
// Classes
app.get('/Classes', classes.index)
app.get('/Classes/:class_id', classes.getByID)
app.post('/Classes/create', classes.create)
app.post('/Classes/delete', classes.delete)
 
// ClassStudents
app.get('/ClassStudents', classStudents.index)
app.get('/ClassStudents/:class_id', classStudents.getByID)
app.get('/ClassStudents/getClassByStudentID/:student_id', classStudents.getClassByStudentID)
app.post('/ClassStudents/create', classStudents.create)
app.post('/ClassStudents/delete', classStudents.delete)


// StudentPaths
app.get('/StudentPaths', studentPaths.index)
app.get('/StudentPaths/:pathID', studentPaths.getByPath)
app.post('/StudentPaths/getPathsByStudentID', studentPaths.getPathsByStudentID)
app.post('/StudentPaths/create', studentPaths.create)
app.post('/StudentPaths/delete', studentPaths.delete)


// CompletedSessions
app.get('/CompletedSessions', completedSessions.index)
app.post('/CompletedSessions/getCompletedByStudentID/:studentID', completedSessions.getCompletedByStudentID)
app.post('/CompletedSessions/delete', completedSessions.delete)

// Attendance
app.get('/Attendance', Attendance.index)
app.post('/Attendance/create', Attendance.create)
app.get('/Attendance/getAttendanceByStudent/:studentID', Attendance.getAttendanceByStudent)
app.post('/Attendance/getAttendanceForDay', Attendance.getAttendanceForDay);
 
// submittedTasks
app.get('/SubmittedTasks', submittedTasks.index)
app.get('/SubmittedTasks/:submission_id', submittedTasks.getByID)
app.post('/SubmittedTasks/create', submittedTasks.create) 
app.post('/SubmittedTasks/submit', submittedTasks.submitTaskFromStudent) 
app.post('/SubmittedTasks/grade', submittedTasks.teacherHasGraded) 
app.post('/SubmittedTasks/delete', submittedTasks.delete) 
app.get('/SubmittedTasks/getUngradedTasksByTaskID/:taskID', submittedTasks.getUngradedTasksByTaskID)
app.post('/SubmittedTasks/getLastSubmittedTaskByUser', submittedTasks.getLastSubmittedTaskByUser);
app.post('/SubmittedTasks/getUngradedTasksGroupsByClass', submittedTasks.getUngradedTasksGroupsByClass);
app.post('/SubmittedTasks/getUngradedTasksByClassAndTask', submittedTasks.getUngradedTasksByClassAndTask);
app.post('/SubmittedTasks/getTimeReportForStudent', submittedTasks.getTimeReportForStudent);
app.post('/SubmittedTasks/getGradeReportForStudent', submittedTasks.getGradeReportForStudent);
app.post('/SubmittedTasks/leaderBoard', submittedTasks.leaderBoard);


db
  .sequelize
  .sync({ force: false })
  .complete(function(err) {
    if (err) {
      throw err[0]
    } else {
      http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'))

        db.Admins.findOrCreate({
            name : 'Administrator',
            email : 'admin@gmail.com',
            password : '7c4a8d09ca3762af61e59520943dc26494f8941b'
          })
      });


    }
  })