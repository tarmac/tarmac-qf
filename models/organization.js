module.exports = (sequelize, DataTypes) => {
  const Organization = sequelize.define('Organization', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50],
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'PENDING',
      validate: {
        notEmpty: true,
        // TODO there should be a validation on status in ('..') after we define them
      },
    },
  },
  {
    tableName: 'organization',
    paranoid: true,
    validate: {
      domains() {
        if (!this.domains || this.domains.length === 0) {
          throw new Error('Organization needs to have at least one domain associated')
        }
      },
    },
  })
  Organization.associate = (models) => {
    Organization.hasMany(
      models.OrganizationDomain, {
        as: 'domains',
        foreignKey: {
          name: 'organizationId',
          allowNull: false,
        },
        onDelete: 'CASCADE',
      },
    )
  }

  return Organization
}
