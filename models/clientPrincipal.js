module.exports = (sequelize, DataTypes) => {
  const ClientPrincipal = sequelize.define('ClientPrincipal', {

  }, {
    tableName: 'client_principal',
  })

  ClientPrincipal.associate = (models) => {
    models.Client.belongsToMany(models.User, {
      as: 'principals',
      through: 'ClientPrincipal',
      foreignKey: 'clientId',
    })

    models.User.belongsToMany(models.Client, {
      as: 'principalClients',
      through: 'ClientPrincipal',
      foreignKey: 'principalId',
    })
  }
  return ClientPrincipal
}
