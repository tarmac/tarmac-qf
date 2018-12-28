

const express = require('express')
const db = require('./models')

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

db.sequelize.sync({ force: true }).then(() => {
  /**
   * Listen on provided port, on all network interfaces.
   */
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
  })
})
