module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    score: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1, max: 5,
      },
    },
    trend: DataTypes.STRING,
    reviewDate: DataTypes.DATE,
    link: DataTypes.STRING,
  }, {
    tableName: 'review',
    paranoid: true,
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
  return Review
}
