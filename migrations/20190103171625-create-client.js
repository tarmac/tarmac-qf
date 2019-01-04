module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    CREATE TABLE "client" (
      "id" SERIAL, 
      "name" VARCHAR(255) NOT NULL UNIQUE, 
      "pictureUrl" VARCHAR(255), 
      "slackInternalChannel" VARCHAR(255), 
      "slackClientChannel" VARCHAR(255), 
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, 
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, 
      "organizationId" INTEGER NOT NULL REFERENCES "organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE, 
      "ownerId" INTEGER NOT NULL REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE, 
      "teamLeadId" INTEGER NOT NULL REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE, 
      PRIMARY KEY ("id")
    );
    
    
  `)
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('client')
  },
}
