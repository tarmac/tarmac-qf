const boom = require('express-boom')
const Util = require('../util/util')
const {
  Project, Technology, sequelize,
} = require('../models')


exports.list = async (req, res, next) => {
  const projects = await Project.count({
    where: {
      organizationId: Util.getOrgId(),
    },
  })

  const android = await countProjectsByTag(Util.getOrgId(), 'Android')
  const ios = await countProjectsByTag(Util.getOrgId(), 'IOS')
  const web = await countProjectsByTag(Util.getOrgId(), 'Web')

  const result = {
    projects,
    android,
    ios,
    web,
  }
  res.json(result)
}

async function countProjectsByTag(orgId, tag) {
  return Project.count({
    where: {
      organizationId: orgId,
    },
    include: [{
      model: Technology,
      as: 'technologies',
      where: {
        name: tag,
      },
      // through: { where: {year: 2015}},
      // attributes: ['id']
    }],
  })
}
