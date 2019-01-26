module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
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
    tableName: 'project',
  })
  Project.associate = (models) => {
    models.Project.belongsTo(models.Organization, {
      onDelete: 'RESTRICT',
      foreignKey: {
        name: 'organizationId',
        allowNull: false,
      },
    })

    models.Project.belongsTo(models.User, {
      onDelete: 'RESTRICT',
      foreignKey: {
        name: 'ownerId',
        allowNull: false,
      },
    })

    models.Project.belongsTo(models.User, {
      onDelete: 'RESTRICT',
      foreignKey: {
        name: 'teamLeadId',
        allowNull: false,
      },
    })

    models.Project.hasMany(
      models.Review, {
        as: 'reviews',
        foreignKey: {
          name: 'projectId',
          allowNull: false,
        },
      },
    )
  }
  return Project
}
