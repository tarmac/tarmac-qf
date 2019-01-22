const boom = require('express-boom')
const Util = require('../util/util')
const {
  Client, User, Technology, sequelize,
} = require('../models')


exports.list = async (req, res, next) => {
  const offset = req.query.offset || 0
  const limit = req.query.limit || 25
  const clients = await Client.findAndCountAll({
    include: includePrincipalsAndTechnologies(),
    distinct: true,
    offset,
    limit,
    order: [
      ['name', 'ASC'],
    ],
  })
  res.json(clients)
}

exports.create = async (req, res, next) => {
  const { body } = req
  let transaction

  try {
    transaction = await sequelize.transaction()
    const fields = mergeClient({}, body)
    fields.organizationId = Util.getOrgId()
    // TODO validate ownerId, teamLeadId, principals and technologies exist
    let client = await Client.create(fields, { transaction })

    if (body.principals) {
      await client.setPrincipals(Util.jsonObjectsToIdsArray(body.principals), { transaction })
    }
    if (body.technologies) {
      await client.setTechnologies(Util.jsonObjectsToIdsArray(body.technologies), { transaction })
    }

    client = await Client.findByPk(client.id, {
      include: includePrincipalsAndTechnologies(),
      transaction,
    })
    res.status(201).send(client)

    await transaction.commit()
  } catch (err) {
    // Rollback transaction if any errors were encountered
    await transaction.rollback()
    throw err
  }
}

exports.view = async (req, res, next) => {
  const client = await findClient(req, res)
  if (client) {
    res.json(client)
  }
}

exports.update = async (req, res, next) => {
  const { body } = req
  let transaction

  try {
    transaction = await sequelize.transaction()
    let client = await findClient(req, res)
    if (client) {
      // TODO validate ownerId, teamLeadId, principals and technologies exist
      mergeClient(client, req.body)
      if (body.principals) {
        await client.setPrincipals(Util.jsonObjectsToIdsArray(body.principals), { transaction })
      }
      if (body.technologies) {
        await client.setTechnologies(Util.jsonObjectsToIdsArray(body.technologies), { transaction })
      }
      await client.save({ transaction })

      client = await Client.findByPk(client.id, {
        include: includePrincipalsAndTechnologies(),
        transaction,
      })
      res.status(200).send(client)

      await transaction.commit()
    }
  } catch (err) {
    // Rollback transaction if any errors were encountered
    await transaction.rollback()
    throw err
  }
}

exports.delete = async (req, res, next) => {
  const obj = await findClient(req, res)
  if (obj) {
    await obj.destroy()
    res.status(200).send()
  }
}

async function findClient(req, res) {
  const obj = await Client.findByPk(req.params.id, {
    include: includePrincipalsAndTechnologies(),
  })
  if (!obj) {
    res.boom.notFound('Client not found')
  }
  return obj
}

function mergeClient(client, fieldMap) {
  const keys = [
    'name', 'ownerId', 'teamLeadId', 'pictureUrl',
    'slackInternalChannel', 'slackClientChannel',
  ]
  return Util.mergeObject(client, keys, fieldMap)
}

function includePrincipalsAndTechnologies() {
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
  }]
}
