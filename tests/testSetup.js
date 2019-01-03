const db = require('../models')

module.exports = async () => {
  // Code that runs before tests goes here
  await db.sequelize.sync({ force: true })
}
