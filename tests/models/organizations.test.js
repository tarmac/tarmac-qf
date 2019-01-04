const db = require('../../models')

const { Organization } = db
const Util = require('../testUtil.js')

beforeAll(async () => {
  // Code that runs before every test goes here
})

afterAll(() => {
  // db.sequelize.close().then(() => console.log('Shut down gracefully'))
})

describe('Organization Model', () => {
  const requiredFields = ['name', 'status', 'domains']
  requiredFields.forEach((field) => {
    test(`Organization should require a ${field}`, async (done) => {
      Util.saveObjectWithoutField(await Util.buildTestOrganization(), field, done)
    })
  })

  test('Organization is saved OK with all the fields', async (done) => {
    const organization = await Util.createTestOrganization()
    expect(organization.id).toBeDefined()
    const dbOrganization = await Organization.findOne({ where: { id: organization.id } })
    requiredFields.forEach((field) => {
      expect(dbOrganization.field).toEqual(organization.field)
    })

    done()
  })
})
