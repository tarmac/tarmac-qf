module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    CREATE TABLE "client_principal" (
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, 
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, 
      "clientId" INTEGER REFERENCES "client" ("id") ON DELETE CASCADE ON UPDATE CASCADE, 
      "principalId" INTEGER REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE, 
      PRIMARY KEY ("clientId", "principalId")
    );    
  `)
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('client_principal')
  },
}
