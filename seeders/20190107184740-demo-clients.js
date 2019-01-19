const models = require('../models')

const {
  Organization, Client, User, Technology,
} = models

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const organization = await Organization.findOne({ where: { name: 'Tarmac' } })

    const alvaro = await User.findOne({ where: { email: 'alvaro@tarmac.io' } })
    const tony = await User.findOne({ where: { email: 'anthony@tarmac.io' } })
    const bosio = await User.findOne({ where: { email: 'diego@tarmac.io' } })
    const juan = await User.findOne({ where: { email: 'juan.antelo@tarmac.io' } })

    const android = await Technology.findOne({ where: { name: 'Android' } })
    const node = await Technology.findOne({ where: { name: 'Node.js' } })

    const client = Client.build({
      name: 'Trusted Herd',
      organizationId: organization.id,
      ownerId: tony.id,
      teamLeadId: alvaro.id,
      slackInternalChannel: 'trusted-herd-internal',
      slackClientChannel: 'trusted-herd',
    })
    await client.save()
    await client.setPrincipals([bosio, juan])
    await client.setTechnologies([android, node])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('client', null, {})
  },
}
