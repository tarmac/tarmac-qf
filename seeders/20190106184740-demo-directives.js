const models = require('../models')

const {
  Organization, Directive,
} = models

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const organization = await Organization.findOne({ where: { name: 'Tarmac' } })

    return Directive.bulkCreate([{
      title: 'Branch Isolation',
      subtitle: 'gitflow - one feature/bug',
      organizationId: organization.id,
    },
    {
      title: 'Code Style',
      subtitle: null,
      organizationId: organization.id,
    },
    {
      title: 'Tests',
      subtitle: 'unit, integration, functional',
      organizationId: organization.id,
    },
    {
      title: 'Continuoous Integration',
      subtitle: null,
      organizationId: organization.id,
    },
    {
      title: 'Pull Requests',
      subtitle: 'descriptive PR, commits',
      organizationId: organization.id,
    }])
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('directive', null, {})
  },
}
