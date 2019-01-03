

const express = require('express')
const bodyParser = require('body-parser')
const boom = require('express-boom')
const morgan = require('morgan')

const db = require('./models')
const apiRouter = require('./routes/api-routes')

const app = express()
const port = 3000

// Logs requests
app.use(morgan('combined', {
  immediate: true,
}))
// Logs responses
app.use(morgan('combined'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(boom())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api', apiRouter)

if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  db.sequelize.sync({ force: true }).then(() => {
    startListening()
  })
} else {
  startListening()
}


function startListening() {
  /**
  * Listen on provided port, on all network interfaces.
  */
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
  })
}

module.exports = app
