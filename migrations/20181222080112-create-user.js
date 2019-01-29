module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    CREATE TABLE "users" (
      "id" SERIAL PRIMARY KEY,
      "firstName" varchar NOT NULL,
      "lastName" varchar NOT NULL,
      "email" varchar UNIQUE NOT NULL,
      "password" varchar NOT NULL,
      "slackName" varchar NOT NULL,
      "organizationId" int NOT NULL REFERENCES organization,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
      "deletedAt" TIMESTAMP WITH TIME ZONE
    );
  `)
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users')
  },
}
