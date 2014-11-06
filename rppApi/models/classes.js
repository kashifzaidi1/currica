module.exports = function(sequelize, DataTypes) {
  var Classes = sequelize.define('Classes', {
    uuid : {
      type : DataTypes.UUID,
      defaultValue : DataTypes.UUIDV1,
      primarykey : true
    },
    name : {
      type : DataTypes.TEXT,
      defaultValue : "not set"
    }
  }, {
    classMethods : {
      associate: function(models) {
        Classes.belongsTo(models.Teachers);
        Classes.hasMany(models.ClassStudents);
      }
    }
  })
 
  return Classes
}