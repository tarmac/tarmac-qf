const boom = require('express-boom')
const Util = require('../util/util')
const {
  Technology, sequelize,
} = require('../models')

exports.list = async (req, res, next) => {
  const offset = req.query.offset || 0
  const limit = req.query.limit || 25
  const techs = await Technology.findAndCountAll({
    // TODO once auth is implemented the org should be taken out of the current user
    // where: {
    //   organizationId: getOrgId(),
    // },
    offset,
    limit,
  })
  res.json(techs)
}

exports.create = async (req, res, next) => {
  const { body } = req
  const fields = mergeTech({}, body)
  fields.organizationId = Util.getOrgId()
  const tech = await Technology.create(fields)
  res.status(201).send(tech)
}

exports.view = async (req, res, next) => {
  const tech = await findTech(req, res)
  if (tech) {
    res.json(tech)
  }
}

exports.update = async (req, res, next) => {
  const { body } = req
  const tech = await findTech(req, res)
  if (tech) {
    mergeTech(tech, req.body)
    await tech.save()
    res.status(200).send(tech)
  }
}

exports.delete = async (req, res, next) => {
  const obj = await findTech(req, res)
  if (obj) {
    await obj.destroy()
    res.status(200).send()
  }
}

async function findTech(req, res) {
  const obj = await Technology.findByPk(req.params.id)
  if (!obj) {
    res.boom.notFound('Technology not found')
  }
  return obj
}

function mergeTech(tech, fieldMap) {
  const keys = [
    'name', 'description',
  ]
  return Util.mergeObject(tech, keys, fieldMap)
}
