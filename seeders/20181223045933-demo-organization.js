module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('organization', [{
      name: 'Tarmac',
      status: 'APPROVED',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('organization', null, {})
  },
}
