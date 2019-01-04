const db = require('../../models')

const { Technology, Organization } = db
const Util = require('../testUtil.js')

beforeAll(async () => {
  // Code that runs before every test goes here
})

afterAll(() => {
  // db.sequelize.close().then(() => console.log('Shut down gracefully'))
})

describe('Technology Model', () => {
  const requiredFields = ['name', 'organizationId']
  requiredFields.forEach((field) => {
    test(`Technology should require a ${field}`, async (done) => {
      Util.saveObjectWithoutField(await Util.createTestTechnology(), field, done)
    })
  })

  test('Client is saved OK with all the fields', async (done) => {
    const tech = await Util.createTestTechnology()
    expect(tech.id).toBeDefined()
    const dbTech = await Technology.findOne({ where: { id: tech.id } })
    requiredFields.forEach((field) => {
      expect(dbTech.field).toEqual(tech.field)
    })

    done()
  })
})
