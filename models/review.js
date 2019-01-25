const Util = require('../util/util')

module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    score: {
      type: DataTypes.DECIMAL,
      validate: {
        min: 1, max: 5,
      },
    },
    trend: DataTypes.STRING,
    reviewDate: DataTypes.DATE,
    link: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
  }, {
    tableName: 'review',
    paranoid: true,
    hooks: {
      beforeValidate: (review, options) => {
        if (!review.link) {
          review.link = Util.randomString(30)
        }
      },
    },
  })
  Review.associate = (models) => {
    models.Review.belongsTo(models.User, {
      onDelete: 'RESTRICT',
      foreignKey: {
        name: 'reviewerId',
      },
    })

    models.Review.belongsTo(models.Client, {
      onDelete: 'RESTRICT',
      foreignKey: {
        name: 'clientId',
        allowNull: false,
      },
    })
  }

  Review.prototype.updateScore = function updateScore(directives) {
    if (directives.length > 0) {
      let score = 0
      directives.forEach((directive) => {
        if (directive.ReviewDirective.compliant) {
          score += 5
        } else {
          score += 1 // These values are arbitrary, can be changed to anything
        }
      })
      this.score = score / directives.length
    }
  }

  return Review
}
