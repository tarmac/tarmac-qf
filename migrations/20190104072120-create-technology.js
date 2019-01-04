module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    CREATE TABLE "technology" (
      "id" SERIAL, 
      "name" VARCHAR(255) NOT NULL UNIQUE, 
      "description" VARCHAR(255), 
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, 
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, 
      "organizationId" INTEGER NOT NULL REFERENCES "organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE, 
      PRIMARY KEY ("id")
    );  
  `)
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('technology')
  },
}
