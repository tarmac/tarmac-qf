module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    CREATE TABLE "review_directive" (
      "compliant" BOOLEAN, 
      "notes" VARCHAR(255), 
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, 
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, 
      "reviewId" INTEGER REFERENCES "review" ("id") ON DELETE CASCADE ON UPDATE CASCADE, 
      "directiveId" INTEGER REFERENCES "directive" ("id") ON DELETE CASCADE ON UPDATE CASCADE, 
      PRIMARY KEY ("reviewId", "directiveId")
    );        
  `)
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('review_directive')
  },
}
