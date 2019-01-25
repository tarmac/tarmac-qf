module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100],
      },
    },
    pictureUrl: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: true,
      },
    },
    slackInternalChannel: DataTypes.STRING,
    slackClientChannel: DataTypes.STRING,
  }, {
    tableName: 'client',
  })
  Client.associate = (models) => {
    models.Client.belongsTo(models.Organization, {
      onDelete: 'RESTRICT',
      foreignKey: {
        name: 'organizationId',
        allowNull: false,
      },
    })

    models.Client.belongsTo(models.User, {
      onDelete: 'RESTRICT',
      foreignKey: {
        name: 'ownerId',
        allowNull: false,
      },
    })

    models.Client.belongsTo(models.User, {
      onDelete: 'RESTRICT',
      foreignKey: {
        name: 'teamLeadId',
        allowNull: false,
      },
    })

    models.Client.hasMany(
      models.Review, {
        as: 'reviews',
        foreignKey: {
          name: 'clientId',
          allowNull: false,
        },
      },
    )
  }
  return Client
}
