module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    CREATE TABLE "organization" (
      "id" SERIAL PRIMARY KEY,
      "name" varchar UNIQUE NOT NULL,
      "status" varchar NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
      "deletedAt" TIMESTAMP WITH TIME ZONE
    );
  `)
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('organization')
  },
}
