const db = require('../models')

module.exports = async () => {
  // Code that runs after tests goes here
  console.log('Shutting down db connection...')
  await db.sequelize.sync({ force: true })
  db.sequelize.close().then(() => {
    console.log('Shut down db gracefully')
  })
}
