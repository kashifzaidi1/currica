module.exports = function(sequelize, DataTypes) {
  var Paths = sequelize.define('Paths', {
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
        Paths.hasMany(models.Sessions)
        // Paths.hasMany(models.Students);
        Paths.hasMany(models.StudentPaths);
      }
    }
  })
 
  return Paths
}