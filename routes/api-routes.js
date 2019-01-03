const express = require('express')
const boom = require('express-boom')

const organizations = require('../controllers/organizations')

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
