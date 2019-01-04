module.exports = (sequelize, DataTypes) => {
  const Directive = sequelize.define('Directive', {
    description: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  }, {
    tableName: 'directive',
  })
  Directive.associate = (models) => {
    models.Directive.belongsTo(models.Organization, {
      onDelete: 'RESTRICT',
      foreignKey: {
        name: 'organizationId',
        allowNull: false,
      },
    })
  }
  return Directive
}
