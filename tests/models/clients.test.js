const db = require('../../models')

const { Client, Organization } = db
const Util = require('../testUtil.js')

beforeAll(async () => {
  // Code that runs before every test goes here
})

afterAll(() => {
  // db.sequelize.close().then(() => console.log('Shut down gracefully'))
})

describe('Client Model', () => {
  const requiredFields = ['name', 'organizationId', 'teamLeadId', 'ownerId']
  requiredFields.forEach((field) => {
    test(`Client should require a ${field}`, async (done) => {
      Util.saveObjectWithoutField(await Util.buildTestClient(), field, done)
    })
  })

  test('Client is saved OK with all the fields and principals', async (done) => {
    const client = await Util.createTestClient()
    expect(client.id).toBeDefined()
    let dbClient = await Client.findOne({ where: { id: client.id } })
    requiredFields.forEach((field) => {
      expect(dbClient.field).toEqual(client.field)
    })
    const user1 = await Util.createTestUser()
    const user2 = await Util.createTestUser()
    await client.addPrincipals(user1)
    await client.addPrincipals(user2)

    const tech1 = await Util.createTestTechnology()
    const tech2 = await Util.createTestTechnology()


    await client.addTechnologies(tech1)
    await client.addTechnologies(tech2)
    await client.save()

    dbClient = await Client.findOne({
      where: {
        id: client.id,
      },
      include: [{
        model: db.User,
        as: 'principals',
      },
      {
        model: db.Technology,
        as: 'technologies',
      }],
    })
    const principals = await dbClient.getPrincipals()
    const technologies = await dbClient.getTechnologies()

    expect(principals.length).toBe(2)
    expect(principals.map(u => u.id).sort()).toEqual([user1.id, user2.id].sort())

    expect(technologies.length).toBe(2)
    expect(technologies.map(u => u.id).sort()).toEqual([tech1.id, tech2.id].sort())

    done()
  })
})
