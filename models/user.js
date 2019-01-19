const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50],
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [6, 100],
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: 6,
      },
    },
    slackName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50],
      },
    },
    pictureUrl: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    tableName: 'users',
    paranoid: true,
    instanceMethods: {},
  })
  User.associate = (models) => {
    models.User.belongsTo(models.Organization, {
      onDelete: 'RESTRICT',
      foreignKey: {
        name: 'organizationId',
        allowNull: false,
      },
    })
  }


  User.beforeSave((user, options) => {
    return User.hashPassword(user, options)
  })

  User.beforeBulkCreate(async (users, options) => {
    const promises = []
    users.forEach((user) => {
      promises.push(User.hashPassword(user, options))
    })
    return Promise.all(promises)
  })


  User.prototype.isValidPassword = function check(password) {
    if (password === this.password) {
      return false // Prevent returning true if password is not hashed
    }
    return bcrypt.compare(password, this.password)
  }

  /* eslint-disable no-param-reassign */
  User.hashPassword = function hashPassword(user, options) {
    const SALT_FACTOR = 10
    if (!user.changed('password')) {
      return new Promise()
    }

    return bcrypt.hash(user.password, 10)
      .then((hash) => {
        user.password = hash
      })
      .catch((err) => {
        throw new Error()
      })
  }

  return User
}
