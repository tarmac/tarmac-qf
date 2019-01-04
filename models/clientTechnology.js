module.exports = (sequelize, DataTypes) => {
  const ClientTechnology = sequelize.define('ClientTechnology', {

  }, {
    tableName: 'client_technology',
  })

  ClientTechnology.associate = (models) => {
    models.Client.belongsToMany(models.Technology, {
      as: 'technologies',
      through: 'ClientTechnology',
      foreignKey: 'clientId',
    })

    models.Technology.belongsToMany(models.Client, {
      as: 'clients',
      through: 'ClientTechnology',
      foreignKey: 'technologyId',
    })
  }
  return ClientTechnology
}
