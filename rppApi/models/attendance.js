module.exports = function(sequelize, DataTypes) {
  var Attendance = sequelize.define('Attendance', {
  }, {
    classMethods : {
      associate: function(models) {
        Attendance.belongsTo(models.Students);
      }
    }
  })
 
  return Attendance
}