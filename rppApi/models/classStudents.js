module.exports = function(sequelize, DataTypes) {
  var ClassStudents = sequelize.define('ClassStudents', {
    uuid : {
      type : DataTypes.UUID,
      defaultValue : DataTypes.UUIDV1,
      primarykey : true
    }
  }, {
    classMethods : {
      associate : function(models) {
        ClassStudents.belongsTo(models.Classes);
        ClassStudents.belongsTo(models.Students);
      }
    }
  })
 
  return ClassStudents
}