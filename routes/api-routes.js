const express = require('express')
const boom = require('express-boom')

const organizations = require('../controllers/organizations')
const clients = require('../controllers/clients')
const technologies = require('../controllers/technologies')
const directives = require('../controllers/directives')
const reviews = require('../controllers/reviews')
const stats = require('../controllers/stats')


const router = express.Router()
const { Sequelize } = require('../models')


// Organizations
router.route('/organizations')
  .get((handler(organizations.list)))
  .post(handler(organizations.create))

router.route('/organizations/:id')
  .get(handler(organizations.view))
  .put(handler(organizations.update))
  .delete(handler(organizations.delete))

// Clients
router.route('/clients')
  .get((handler(clients.list)))
  .post(handler(clients.create))

router.route('/clients/:id')
  .get(handler(clients.view))
  .put(handler(clients.update))
  .delete(handler(clients.delete))

// Technologies
router.route('/technologies')
  .get((handler(technologies.list)))
  .post(handler(technologies.create))

router.route('/technologies/:id')
  .get(handler(technologies.view))
  .put(handler(technologies.update))
  .delete(handler(technologies.delete))


// Directives
router.route('/directives')
  .get((handler(directives.list)))
  .post(handler(directives.create))

router.route('/directives/:id')
  .get(handler(directives.view))
  .put(handler(directives.update))
  .delete(handler(directives.delete))

// Reviews
router.route('/clients/:cid/reviews')
  .get((handler(reviews.list)))
  .post(handler(reviews.create))

router.route('/clients/:cid/reviews/:id')
  .get(handler(reviews.view))
  .put(handler(reviews.update))
  .delete(handler(reviews.delete))

// Stats
router.route('/stats')
  .get((handler(stats.list)))

function handler(fn) {
  return (req, res, next) => {
    // Make sure to `.catch()` any errors and pass them along to the `next()`
    // middleware in the chain, in this case the error handler.
    fn(req, res, next).catch(next)
  }
}

// Error handler middleware
router.use((err, req, res, next) => {
  // Validation errors will return a 422 response and unhandled errors a 500
  if (err instanceof Sequelize.ValidationError) {
    let errors = ''
    err.errors.forEach((error) => {
      errors += `${error.message}\n`
    })
    errors = errors.substr(0, errors.length - 1)
    console.log('Validation errors', errors)
    res.boom.badData(errors)
  } else {
    console.log('Internal Server Error - ', err)
    res.boom.badImplementation('Internal Server Error')
  }
})

module.exports = router
