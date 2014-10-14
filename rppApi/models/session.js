module.exports = function(sequelize, DataTypes) {
  var Sessions = sequelize.define('Sessions', {
    uuid : {
      type : DataTypes.UUID,
      defaultValue : DataTypes.UUIDV1,
      primarykey : true
    },
    name : {
      type : DataTypes.STRING,
      defaultValue : "not set"
    },
    description : {
      type : DataTypes.STRING
    }
  }, {
    classMethods : {
      associate : function(models) {
        Sessions.belongsTo(models.Paths);
        Sessions.hasMany(models.CompletedSessions);
        Sessions.hasMany(models.Tasks);
      }
    }
  })
 
  return Sessions
}