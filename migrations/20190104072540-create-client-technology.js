module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS "client_technology" (
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, 
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, 
      "clientId" INTEGER REFERENCES "client" ("id") ON DELETE CASCADE ON UPDATE CASCADE, 
      "technologyId" INTEGER REFERENCES "technology" ("id") ON DELETE CASCADE ON UPDATE CASCADE, 
      PRIMARY KEY ("clientId", "technologyId")
    );    
  `)
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('client_technology')
  },
}
