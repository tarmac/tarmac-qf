const boom = require('express-boom')
const Util = require('../util/util')
const {
  Client, Technology, sequelize,
} = require('../models')


exports.list = async (req, res, next) => {
  const clients = await Client.count({
    where: {
      organizationId: Util.getOrgId(),
    },
  })

  const android = await countClientsByTag(Util.getOrgId(), 'Android')
  const ios = await countClientsByTag(Util.getOrgId(), 'IOS')
  const web = await countClientsByTag(Util.getOrgId(), 'Web')

  const result = {
    clients,
    android,
    ios,
    web,
  }
  res.json(result)
}

async function countClientsByTag(orgId, tag) {
  return Client.count({
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
