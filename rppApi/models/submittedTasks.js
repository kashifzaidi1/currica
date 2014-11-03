module.exports = function(sequelize, DataTypes) {
  var SubmittedTasks = sequelize.define('SubmittedTasks', {
    uuid : {
      type : DataTypes.UUID,
      defaultValue : DataTypes.UUIDV1,
      primarykey : true
    },
    isGraded : {
      type : DataTypes.BOOLEAN,
      defaultValue : false
    },
    submittedFile : {
      type : DataTypes.TEXT
    },
    submittedComment : {
      type : DataTypes.TEXT
    },
    gradeQuality : {
      type : DataTypes.TEXT
    },
    gradeQuantity : {
      type : DataTypes.INTEGER
    },
    startTime : {
      type : DataTypes.DATE,
      defaultValue : DataTypes.NOW
    },
    endTime : {
      type : DataTypes.DATE
    },
    isSubmitted : {
      type : DataTypes.BOOLEAN,
      defaultValue : false
    }
  }, {
    classMethods : {
      associate : function(models){
        SubmittedTasks.belongsTo(models.Tasks);
        SubmittedTasks.belongsTo(models.Students);
        SubmittedTasks.belongsTo(models.Teachers);
      }
    }
  })
 
  return SubmittedTasks
}