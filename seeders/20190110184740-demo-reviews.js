const models = require('../models')

const {
  Review, Client, User, Directive, ReviewDirective,
} = models

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const client = await Client.findOne({ where: { name: 'Trusted Herd' } })
    const directives = await Directive.findAll({
      where: {
        organizationId: client.organizationId,
      },
    })

    const review = await Review.create({
      clientId: client.id,
      reviewDate: new Date(),
    }, { individualHooks: true })

    const ps = []
    for (let i = 0; i < directives.length; i += 1) {
      ps.push(review.addDirective(directives[i], {
        through: {
          compliant: i % 2 === 0,
          notes: 'Some note',
        },
      }))
    }
    await Promise.all(ps)

    review.updateScore(await review.getDirectives())
    await review.save()
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('client', null, {})
  },
}
