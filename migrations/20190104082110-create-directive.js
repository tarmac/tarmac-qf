module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    CREATE TABLE "directive" (
      "id" SERIAL, 
      "title" TEXT, 
      "subtitle" TEXT, 
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, 
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, 
      "organizationId" INTEGER NOT NULL REFERENCES "organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE, 
      PRIMARY KEY ("id")
    );    
  `)
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('directive')
  },
}
