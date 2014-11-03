module.exports = function(sequelize, DataTypes) {
  var Sessions = sequelize.define('Sessions', {
    uuid : {
      type : DataTypes.UUID,
      defaultValue : DataTypes.UUIDV1,
      primarykey : true
    },
    name : {
      type : DataTypes.TEXT,
      defaultValue : "not set"
    },
    description : {
      type : DataTypes.TEXT
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