module.exports = (sequelize, DataTypes) => {
  const Directive = sequelize.define('Directive', {
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    subtitle: {
      type: DataTypes.TEXT,
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
