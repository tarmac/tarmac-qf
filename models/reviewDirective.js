module.exports = (sequelize, DataTypes) => {
  const ReviewDirective = sequelize.define('ReviewDirective', {
    compliant: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'review_directive',
  })
  ReviewDirective.associate = (models) => {
    models.Review.belongsToMany(models.Directive, {
      as: 'directives',
      through: 'ReviewDirective',
      foreignKey: 'reviewId',
    })

    models.Directive.belongsToMany(models.Review, {
      as: 'reviews',
      through: 'ReviewDirective',
      foreignKey: 'directiveId',
    })
  }
  return ReviewDirective
}
