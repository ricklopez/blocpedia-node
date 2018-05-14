const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {msg: "Validation error: must be a valid email"}
      },
      unique: {
          args: true,
          msg: 'Validation error: email already exists',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
    ,
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  },{});

  User.associate = function(models) {
    User.hasMany(models.Collaborator, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });

    User.hasMany(models.Wiki, {
      foreignKey: "UserId",
      onDelete: "CASCADE"
    });
  };

  User.prototype.comparePassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch){
      if(err){
        return cb(err);
      } else {
        cb(null, isMatch);
      }
    });
  }

  User.beforeCreate((user, options) => {
    return bcrypt.hash(user.password, 10)
    .then(hash => {
      user.password = hash;
    })
    .catch(err => { 
      throw new Error(); 
    });
  });

    return User;
};