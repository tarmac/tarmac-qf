module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    CREATE TABLE "review" (
      "id" SERIAL, 
      "score" INTEGER, 
      "trend" VARCHAR(255), 
      "reviewDate" TIMESTAMP WITH TIME ZONE, 
      "link" VARCHAR(255), 
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, 
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, 
      "deletedAt" TIMESTAMP WITH TIME ZONE, 
      "reviewerId" INTEGER REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE, 
      "clientId" INTEGER NOT NULL REFERENCES "client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE, 
      PRIMARY KEY ("id")
    );    
  `)
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('review')
  },
}
