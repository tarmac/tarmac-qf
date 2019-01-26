module.exports = (sequelize, DataTypes) => {
  const ProjectPrincipal = sequelize.define('ProjectPrincipal', {

  }, {
    tableName: 'project_principal',
  })

  ProjectPrincipal.associate = (models) => {
    models.Project.belongsToMany(models.User, {
      as: 'principals',
      through: 'ProjectPrincipal',
      foreignKey: 'projectId',
    })

    models.User.belongsToMany(models.Project, {
      as: 'principalProjects',
      through: 'ProjectPrincipal',
      foreignKey: 'principalId',
    })
  }
  return ProjectPrincipal
}
