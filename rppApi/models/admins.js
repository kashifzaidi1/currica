module.exports = function(sequelize, DataTypes) {
  var Admins = sequelize.define('Admins', {
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
  }, {})
 
  return Admins
}