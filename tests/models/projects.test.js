const db = require('../../models')

const { Project, Organization } = db
const Util = require('../testUtil.js')

beforeAll(async () => {
  // Code that runs before every test goes here
})

afterAll(() => {
  // db.sequelize.close().then(() => console.log('Shut down gracefully'))
})

describe('Project Model', () => {
  const requiredFields = ['name', 'organizationId', 'teamLeadId', 'ownerId']
  requiredFields.forEach((field) => {
    test(`Project should require a ${field}`, async (done) => {
      Util.saveObjectWithoutField(await Util.buildTestProject(), field, done)
    })
  })

  test('Project is saved OK with all the fields and principals', async (done) => {
    const project = await Util.createTestProject()
    expect(project.id).toBeDefined()
    let dbProject = await Project.findOne({ where: { id: project.id } })
    requiredFields.forEach((field) => {
      expect(dbProject.field).toEqual(project.field)
    })
    const user1 = await Util.createTestUser()
    const user2 = await Util.createTestUser()
    await project.setPrincipals([user1, user2])

    const tech1 = await Util.createTestTechnology()
    const tech2 = await Util.createTestTechnology()


    await project.setTechnologies([tech1, tech2])
    await project.save()

    dbProject = await Project.findOne({
      where: {
        id: project.id,
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
    const principals = await dbProject.getPrincipals()
    const technologies = await dbProject.getTechnologies()

    expect(principals.length).toBe(2)
    expect(principals.map(u => u.id).sort()).toEqual([user1.id, user2.id].sort())

    expect(technologies.length).toBe(2)
    expect(technologies.map(u => u.id).sort()).toEqual([tech1.id, tech2.id].sort())

    done()
  })
})
