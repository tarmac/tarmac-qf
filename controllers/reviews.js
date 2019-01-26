const boom = require('express-boom')
const Util = require('../util/util')
const {
  Review, Project, Directive, User, Technology, sequelize,
} = require('../models')


exports.list = async (req, res, next) => {
  const offset = req.query.offset || 0
  const limit = req.query.limit || 25
  const reviews = await Review.findAndCountAll({
    where: {
      projectId: req.params.cid,
    },
    include: includeDirectives(),
    distinct: true,
    offset,
    limit,
  })
  res.json(reviews)
}

exports.create = async (req, res, next) => {
  const { body } = req
  let transaction

  try {
    transaction = await sequelize.transaction()
    const fields = mergeReview({}, body)
    fields.projectId = req.params.cid
    // TODO validate projectId and directives exist
    let review = await Review.create(fields, { transaction })

    if (body.directives) {
      const ps = []
      for (let i = 0; i < body.directives.length; i += 1) {
        ps.push(review.addDirective(body.directives[i].id, {
          through: {
            compliant: body.directives[i].compliant,
            notes: body.directives[i].notes,
          },
          transaction,
        }))
      }
      await Promise.all(ps)

      const directives = await review.getDirectives({ transaction })
      review.updateScore(directives)
      await review.save({ transaction })
    }

    review = await Review.findByPk(review.id, {
      include: includeDirectives(),
      transaction,
    })
    res.status(201).send(review)

    await transaction.commit()
  } catch (err) {
    // Rollback transaction if any errors were encountered
    await transaction.rollback()
    throw err
  }
}

exports.view = async (req, res, next) => {
  const project = await findReview(req, res)
  if (project) {
    res.json(project)
  }
}

exports.update = async (req, res, next) => {
  const { body } = req
  let transaction

  try {
    transaction = await sequelize.transaction()
    let review = await findReview(req, res)
    if (review) {
      // TODO validate ownerId, teamLeadId, principals and technologies exist
      mergeReview(review, req.body)

      if (body.directives) {
        const ps = []
        const newDirectivesIds = Util.jsonObjectsToIdsArray(body.directives)
        const oldDirectives = await review.getDirectives()

        for (let i = 0; i < oldDirectives.length; i += 1) {
          if (!newDirectivesIds.includes(oldDirectives[i].id)) {
            ps.push(review.removeDirective(oldDirectives[i].id), { transaction })
          }
        }

        for (let i = 0; i < body.directives.length; i += 1) {
          ps.push(review.addDirective(body.directives[i].id, {
            through: {
              compliant: body.directives[i].compliant,
              notes: body.directives[i].notes,
            },
            transaction,
          }))
        }

        await Promise.all(ps)

        const directives = await review.getDirectives({ transaction })
        review.updateScore(directives)
        await review.save({ transaction })
      }

      await review.save({ transaction })

      review = await Review.findByPk(review.id, {
        include: includeDirectives(),
        transaction,
      })
      res.status(200).send(review)

      await transaction.commit()
    }
  } catch (err) {
    // Rollback transaction if any errors were encountered
    await transaction.rollback()
    throw err
  }
}

exports.delete = async (req, res, next) => {
  const obj = await findReview(req, res)
  if (obj) {
    await obj.destroy()
    res.status(200).send()
  }
}

// This endpoint should remain public
exports.viewByLink = async (req, res, next) => {
  const obj = await Review.findOne({
    where: {
      link: req.params.link,
    },
    include: includeDirectives(),
  })
  if (!obj) {
    res.boom.notFound('Review not found')
    return
  }
  res.json(obj)
}

async function findReview(req, res) {
  const obj = await Review.findByPk(req.params.id, {
    include: includeDirectives(),
  })
  if (!obj) {
    res.boom.notFound('Review not found')
  }
  return obj
}

function mergeReview(review, fieldMap) {
  const keys = [
    'reviewDate', 'reviewerId', 'projectId',
  ]
  return Util.mergeObject(review, keys, fieldMap)
}

function includeDirectives() {
  return [{
    model: Directive,
    as: 'directives',
    attributes: ['id', 'title', 'subtitle'],
    through: {
      attributes: ['compliant', 'notes'],
    },
  }]
}
