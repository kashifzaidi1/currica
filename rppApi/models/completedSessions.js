module.exports = function(sequelize, DataTypes) {
  var CompletedSessions = sequelize.define('CompletedSessions', {    
  }, {
    classMethods : {
      associate: function(models) {
        CompletedSessions.belongsTo(models.Sessions);
        CompletedSessions.belongsTo(models.Students);
      }
    }
  })
 
  return CompletedSessions
}