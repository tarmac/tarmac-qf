module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    CREATE TABLE "project_principal" (
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, 
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, 
      "projectId" INTEGER REFERENCES "project" ("id") ON DELETE CASCADE ON UPDATE CASCADE, 
      "principalId" INTEGER REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE, 
      PRIMARY KEY ("projectId", "principalId")
    );    
  `)
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('project_principal')
  },
}
