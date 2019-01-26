module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS "project_technology" (
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, 
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, 
      "projectId" INTEGER REFERENCES "project" ("id") ON DELETE CASCADE ON UPDATE CASCADE, 
      "technologyId" INTEGER REFERENCES "technology" ("id") ON DELETE CASCADE ON UPDATE CASCADE, 
      PRIMARY KEY ("projectId", "technologyId")
    );    
  `)
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('project_technology')
  },
}
