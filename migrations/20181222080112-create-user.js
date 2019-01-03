module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    CREATE TABLE "users" (
      "id" SERIAL, 
      "firstName" VARCHAR(255) NOT NULL, 
      "lastName" VARCHAR(255) NOT NULL, 
      "email" VARCHAR(255) NOT NULL UNIQUE, 
      "password" VARCHAR(255) NOT NULL, 
      "slackName" VARCHAR(255) NOT NULL, 
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, 
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, 
      "deletedAt" TIMESTAMP WITH TIME ZONE, 
      "organizationId" INTEGER NOT NULL REFERENCES "organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE, 
      PRIMARY KEY ("id")
    );
  `)
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users')
  },
}
