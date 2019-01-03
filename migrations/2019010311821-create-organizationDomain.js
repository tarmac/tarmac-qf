module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    CREATE TABLE "organization_domain" (
      "id" SERIAL, 
      "domain" VARCHAR(255) NOT NULL UNIQUE, 
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, 
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, 
      "deletedAt" TIMESTAMP WITH TIME ZONE, 
      "organizationId" INTEGER NOT NULL REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, 
      PRIMARY KEY ("id")
    );
  `)
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('organization_domain')
  },
}
