module.exports = (sequelize, DataTypes) => {
  const ProjectTechnology = sequelize.define('ProjectTechnology', {

  }, {
    tableName: 'project_technology',
  })

  ProjectTechnology.associate = (models) => {
    models.Project.belongsToMany(models.Technology, {
      as: 'technologies',
      through: 'ProjectTechnology',
      foreignKey: 'projectId',
    })

    models.Technology.belongsToMany(models.Project, {
      as: 'projects',
      through: 'ProjectTechnology',
      foreignKey: 'technologyId',
    })
  }
  return ProjectTechnology
}
