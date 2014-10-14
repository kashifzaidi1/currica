

module.exports = function(sequelize, DataTypes) {
  var Students = sequelize.define('Students', {
    uuid : {
      type : DataTypes.UUID,
      defaultValue : DataTypes.UUIDV1,
      primarykey : true
    },
    name : {
      type : DataTypes.STRING,
      defaultValue : "not set"
    },
    email : {
      type : DataTypes.STRING,
      unique : true,
      validate : {
        isEmail : true
      }
    },
    password : {
      type : DataTypes.STRING
    }
  }, {
    classMethods : {
      associate : function(models) {
        Students.hasMany(models.ClassStudents);
        Students.hasMany(models.StudentPaths);
        Students.hasMany(models.CompletedSessions);
        Students.hasMany(models.Attendance);
        Students.hasMany(models.SubmittedTasks);
        // Students.belongsTo(models.Paths);
      }
    }
  })
 
  return Students
}