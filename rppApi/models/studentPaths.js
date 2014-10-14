module.exports = function(sequelize, DataTypes) {
  var StudentPaths = sequelize.define('StudentPaths', {
    uuid : {
      type : DataTypes.UUID,
      defaultValue : DataTypes.UUIDV1,
      primarykey : true
    }
  }, {
    classMethods : {
      associate : function(models) {
        StudentPaths.belongsTo(models.Paths);
        StudentPaths.belongsTo(models.Students);
      }
    }
  })
 
  return StudentPaths
}