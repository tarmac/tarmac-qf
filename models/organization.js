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
      validate: {
        notEmpty: true,
        // TODO there should be a validation on status in ('..') after we define them
      },
    },
  },
  {
    tableName: 'organization',
    paranoid: true,
  })
  Organization.associate = (models) => {
    // associations can be defined here
  }
  return Organization
}
