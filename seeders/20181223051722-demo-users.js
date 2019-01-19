const models = require('../models')

const { Organization, User } = models

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const organization = await Organization.findOne({ where: { name: 'Tarmac' } })

    // Using queryInterface.bulkInsert wasn't running the individual hooks
    return User.bulkCreate([{
      firstName: 'Alvaro',
      lastName: 'Scuccimarra',
      email: 'alvaro@tarmac.io',
      password: 'password',
      slackName: 'alvaro',
      organizationId: organization.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstName: 'Anthony',
      lastName: 'Schmidt',
      email: 'anthony@tarmac.io',
      password: 'password',
      slackName: 'anthony',
      organizationId: organization.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstName: 'Brent',
      lastName: 'Kastner',
      email: 'brent@tarmac.io',
      password: 'password',
      slackName: 'brent',
      organizationId: organization.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstName: 'Juan',
      lastName: 'Antelo',
      email: 'juan.antelo@tarmac.io',
      password: 'password',
      slackName: 'janteloo',
      organizationId: organization.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstName: 'Diego',
      lastName: 'Pedemonte',
      email: 'diego@tarmac.io',
      password: 'password',
      slackName: 'bosio',
      organizationId: organization.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {
      validate: true,
      individualHooks: true,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {})
  },
}
