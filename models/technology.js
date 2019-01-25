module.exports = (sequelize, DataTypes) => {
  const Technology = sequelize.define('Technology', {
    name: {
      type: DataTypes.STRING,
      unique: true, // TODO This should be unique per organization (same for directives, clients)
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50],
      },
    },
    description: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
  }, {
    tableName: 'technology',
  })
  Technology.associate = (models) => {
    models.Technology.belongsTo(models.Organization, {
      onDelete: 'RESTRICT',
      foreignKey: {
        name: 'organizationId',
        allowNull: false,
      },
    })
  }
  return Technology
}
