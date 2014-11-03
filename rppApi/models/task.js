module.exports = function(sequelize, DataTypes) {
  var Tasks = sequelize.define('Tasks', {
    uuid : {
      type : DataTypes.UUID,
      defaultValue : DataTypes.UUIDV1,
      primarykey : true
    },
    name : {
      type : DataTypes.TEXT,
      defaultValue : "not set"
    },
    link : {
      type : DataTypes.TEXT
    },
    description : {
      type : DataTypes.TEXT
    },
    taskSequenceNumber : {
      type : DataTypes.INTEGER
    }
  }, {
    classMethods : {
      associate : function(models){
        Tasks.belongsTo(models.Sessions);
        Tasks.hasMany(models.SubmittedTasks);
      }
    }
  })
 
  return Tasks
}