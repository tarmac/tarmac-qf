const boom = require('express-boom')
const Util = require('../util/util')
const { Organization, OrganizationDomain } = require('../models')


exports.list = async (req, res, next) => {
  const offset = req.query.offset || 0
  const limit = req.query.limit || 25
  const organizations = await Organization.findAndCountAll({
    include: ['domains'],
    distinct: true,
    offset,
    limit,
    order: [
      ['name', 'ASC'],
    ],
  })
  res.json(organizations)
}

exports.create = async (req, res, next) => {
  const { domains } = req.body
  if (!domains) {
    res.boom.badData('Organization needs to have at least one domain associated')
  } else {
    // TODO validate none of the domains exist already
    const org = await Organization.create({
      name: req.body.name,
      domains,
    }, { include: ['domains'] })
    res.status(201).send(org)
  }
}

exports.view = async (req, res, next) => {
  const org = await findOrganization(req, res)
  if (org) {
    res.json(org)
  }
}

exports.update = async (req, res, next) => {
  const org = await findOrganization(req, res)
  if (org) {
    org.name = req.body.name || org.name
    org.status = req.body.status || org.status
    await org.save()
    res.status(200).send(org)
  }
}

exports.delete = async (req, res, next) => {
  const org = await findOrganization(req, res)
  if (org) {
    await org.destroy()
    res.status(200).send()
  }
}

async function findOrganization(req, res) {
  const org = await Organization.findByPk(req.params.id, { include: ['domains'] })
  if (!org) {
    res.boom.notFound('Organization not found')
  }
  return org
}
