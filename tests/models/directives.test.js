const db = require('../../models')

const { Directive, Organization } = db
const Util = require('../testUtil.js')

beforeAll(async () => {
  // Code that runs before every test goes here
})

afterAll(() => {
  // db.sequelize.close().then(() => console.log('Shut down gracefully'))
})

describe('Directive Model', () => {
  const requiredFields = ['title', 'organizationId']
  requiredFields.forEach((field) => {
    test(`Directive should require a ${field}`, async (done) => {
      Util.saveObjectWithoutField(await Util.createTestDirective(), field, done)
    })
  })

  test('Project is saved OK with all the fields', async (done) => {
    const dir = await Util.createTestDirective()
    expect(dir.id).toBeDefined()
    const dbDir = await Directive.findOne({ where: { id: dir.id } })
    requiredFields.forEach((field) => {
      expect(dbDir.field).toEqual(dir.field)
    })

    done()
  })
})
