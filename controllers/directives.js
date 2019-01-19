const boom = require('express-boom')
const Util = require('../util/util')
const {
  Directive, sequelize,
} = require('../models')


exports.list = async (req, res, next) => {
  const offset = req.query.offset || 0
  const limit = req.query.limit || 25
  const dirs = await Directive.findAndCountAll({
    // TODO once auth is implemented the org should be taken out of the current user
    // where: {
    //   organizationId: getOrgId(),
    // },
    offset,
    limit,
  })
  res.json(dirs)
}

exports.create = async (req, res, next) => {
  const { body } = req
  const fields = mergeDir({}, body)
  fields.organizationId = Util.getOrgId()
  const dir = await Directive.create(fields)
  res.status(201).send(dir)
}

exports.view = async (req, res, next) => {
  const dir = await findDir(req, res)
  if (dir) {
    res.json(dir)
  }
}

exports.update = async (req, res, next) => {
  const { body } = req
  const dir = await findDir(req, res)
  if (dir) {
    // TODO validate ownerId, teamLeadId, principals and directives exist
    mergeDir(dir, req.body)
    await dir.save()
    res.status(200).send(dir)
  }
}

exports.delete = async (req, res, next) => {
  const obj = await findDir(req, res)
  if (obj) {
    await obj.destroy()
    res.status(200).send()
  }
}

async function findDir(req, res) {
  const obj = await Directive.findByPk(req.params.id)
  if (!obj) {
    res.boom.notFound('Directive not found')
  }
  return obj
}

function mergeDir(dir, fieldMap) {
  const keys = [
    'name', 'title', 'subtitle',
  ]
  return Util.mergeObject(dir, keys, fieldMap)
}
