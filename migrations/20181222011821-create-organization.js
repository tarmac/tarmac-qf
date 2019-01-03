module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    CREATE TABLE "organization" (
      "id" SERIAL,
      "name" varchar UNIQUE NOT NULL,
      "status" varchar NOT NULL DEFAULT 'PENDING',
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
      "deletedAt" TIMESTAMP WITH TIME ZONE,
      PRIMARY KEY ("id")
    );
  `)
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('organization')
  },
}
