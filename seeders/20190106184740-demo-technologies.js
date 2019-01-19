const models = require('../models')

const { Organization, Technology, User } = models

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const organization = await Organization.findOne({ where: { name: 'Tarmac' } })

    return Technology.bulkCreate([{
      name: 'Android',
      organizationId: organization.id,
    },
    {
      name: 'IOS',
      organizationId: organization.id,
    },
    {
      name: 'Node.js',
      organizationId: organization.id,
    },
    {
      name: 'Java',
      organizationId: organization.id,
    },
    {
      name: 'Ruby',
      organizationId: organization.id,
    }])
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('technology', null, {})
  },
}
