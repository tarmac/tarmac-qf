const models = require('../models')

const { Organization, User } = models

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const organization = await Organization.findOne({
      where: {
        name: 'Tarmac',
      },
    })
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
    }], {
      validate: true,
      individualHooks: true,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {})
  },
}
