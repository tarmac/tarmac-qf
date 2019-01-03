module.exports = (sequelize, DataTypes) => {
  const OrganizationDomain = sequelize.define('OrganizationDomain', {
    domain: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50],
      },
    },
  },
  {
    tableName: 'organization_domain',
    paranoid: true,
  })
  OrganizationDomain.associate = (models) => {

  }

  return OrganizationDomain
}
