const boom = require('express-boom')
const Util = require('../util/util')
const {
  Project, User, Technology, Review, Directive, sequelize,
} = require('../models')


exports.list = async (req, res, next) => {
  const offset = req.query.offset || 0
  const limit = req.query.limit || 25
  const projects = await Project.findAndCountAll({
    include: includePrincipalsAndTechnologiesAndReviews(),
    distinct: true,
    offset,
    limit,
    order: [
      ['name', 'ASC'],
    ],
  })
  res.json(projects)
}

exports.create = async (req, res, next) => {
  const { body } = req
  let transaction

  try {
    transaction = await sequelize.transaction()
    const fields = mergeProject({}, body)
    fields.organizationId = Util.getOrgId()
    // TODO validate ownerId, teamLeadId, principals and technologies exist
    let project = await Project.create(fields, { transaction })

    if (body.principals) {
      await project.setPrincipals(Util.jsonObjectsToIdsArray(body.principals), { transaction })
    }
    if (body.technologies) {
      await project.setTechnologies(Util.jsonObjectsToIdsArray(body.technologies), { transaction })
    }

    project = await Project.findByPk(project.id, {
      include: includePrincipalsAndTechnologiesAndReviews(),
      transaction,
    })
    res.status(201).send(project)

    await transaction.commit()
  } catch (err) {
    // Rollback transaction if any errors were encountered
    await transaction.rollback()
    throw err
  }
}

exports.view = async (req, res, next) => {
  const project = await findProject(req, res)
  if (project) {
    res.json(project)
  }
}

exports.update = async (req, res, next) => {
  const { body } = req
  let transaction

  try {
    transaction = await sequelize.transaction()
    let project = await findProject(req, res)
    if (project) {
      // TODO validate ownerId, teamLeadId, principals and technologies exist
      mergeProject(project, req.body)
      if (body.principals) {
        await project.setPrincipals(Util.jsonObjectsToIdsArray(body.principals), { transaction })
      }
      if (body.technologies) {
        await project.setTechnologies(
          Util.jsonObjectsToIdsArray(body.technologies),
          { transaction },
        )
      }
      await project.save({ transaction })

      project = await Project.findByPk(project.id, {
        include: includePrincipalsAndTechnologiesAndReviews(),
        transaction,
      })
      res.status(200).send(project)

      await transaction.commit()
    }
  } catch (err) {
    // Rollback transaction if any errors were encountered
    await transaction.rollback()
    throw err
  }
}

exports.delete = async (req, res, next) => {
  const obj = await findProject(req, res)
  if (obj) {
    await obj.destroy()
    res.status(200).send()
  }
}

async function findProject(req, res) {
  const obj = await Project.findByPk(req.params.id, {
    include: includePrincipalsAndTechnologiesAndReviews(),
  })
  if (!obj) {
    res.boom.notFound('Project not found')
  }
  return obj
}

function mergeProject(project, fieldMap) {
  const keys = [
    'name', 'ownerId', 'teamLeadId', 'pictureUrl',
    'slackInternalChannel', 'slackClientChannel',
  ]
  return Util.mergeObject(project, keys, fieldMap)
}

function includePrincipalsAndTechnologiesAndReviews() {
  return [{
    model: User,
    as: 'principals',
    attributes: ['id', 'firstName', 'lastName'],
    through: {
      attributes: [],
    },
  },
  {
    model: Technology,
    as: 'technologies',
    attributes: ['id', 'name', 'description'],
    through: {
      attributes: [],
    },
  },
  /* TODO instead of returning just the list of reviews,
    the reviews could be a map by month in desc order, like:
    [
      [ // Making this a list just in case, currently 1 review per month
        {review} // current's month review
      ],
      [], // missing review
      [
        {review} // review from 2 months ago
      ],
      ...
    ]
    That way it'll be easier for the UI to render the reviews history
  */
  {
    model: Review,
    as: 'reviews',
  }]
}
