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
    test(`Organization should require a ${field}`, (done) => {
      saveOrganizationWithoutField(field, done)
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

async function saveOrganizationWithoutField(field, done) {
  const organization = await Util.buildTestOrganization()
  organization[field] = null

  expect.assertions(3)
  try {
    await organization.validate()
  } catch (err) {
    expect(err.name).toEqual('SequelizeValidationError')
    expect(err.errors.length).toBe(1)
    expect(err.errors[0].path).toEqual(field)
    done()
  }
}
