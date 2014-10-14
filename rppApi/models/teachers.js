module.exports = function(sequelize, DataTypes) {
  var Teachers = sequelize.define('Teachers', {
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
        Teachers.hasMany(models.Classes);
        Teachers.hasMany(models.SubmittedTasks);
      }
    }
  })
 
  return Teachers
}