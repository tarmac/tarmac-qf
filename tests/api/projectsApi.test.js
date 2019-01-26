const request = require('supertest')
const db = require('../../models')
const app = require('../../index')
const Util = require('../testUtil.js')

const apiUrl = '/api/projects'
const projectSchema = {
  id: '',
  name: '',
  ownerId: '',
  teamLeadId: '',
  pictureUrl: '',
  slackInternalChannel: '',
  slackClientChannel: '',
  principals: '',
  technologies: '',
  reviews: '',
  organizationId: '',
}

const principalSchema = {
  id: '',
  firstName: '',
  lastName: '',
}

const technologySchema = {
  id: '',
  name: '',
  description: '',
}

beforeAll(async () => {
  // Code that runs before every test goes here
})

afterAll(() => {

})

describe('List Projects', () => {
  test('respond with json containing a list of all projects', async (done) => {
    const dbCli = await Util.createTestProject()
    expect(dbCli.id).toBeDefined()

    request(app)
      .get(apiUrl)
      .expect('Content-Type', /json/)
      .expect(200, (err, res) => {
        expect(err).toBeNull()
        Util.validateSchema(res.body, { count: '', rows: '' })
        const list = res.body.rows
        expect(res.body.count).not.toBeLessThan(1)
        expect(list.length).not.toBeLessThan(1)
        Util.validateSchema(list[0], projectSchema)
        const result = list.find(cli => cli.id === dbCli.id)
        expect(result).not.toBeUndefined()
        done(err)
      })
  })
})

describe('View Project', () => {
  test('respond with json with the project', async (done) => {
    const dbCli = await Util.createTestProject()
    const principals = await dbCli.getPrincipals()
    const techs = await dbCli.getTechnologies()


    request(app)
      .get(`${apiUrl}/${dbCli.id}`)
      .expect('Content-Type', /json/)
      .expect(200, (err, res) => {
        expect(err).toBeNull()
        Util.validateSchema(res.body, projectSchema)
        expect(res.body.id).toEqual(dbCli.id)
        expect(res.body.name).toEqual(dbCli.name)

        expect(res.body.principals.length).toBe(2)
        Util.validateSchema(res.body.principals[0], principalSchema)
        expect(res.body.principals[0].id).toEqual(principals[0].id)
        expect(res.body.principals[1].id).toEqual(principals[1].id)

        expect(res.body.technologies.length).toBe(2)
        Util.validateSchema(res.body.technologies[0], technologySchema)
        expect(res.body.technologies[0].id).toEqual(techs[0].id)
        expect(res.body.technologies[1].id).toEqual(techs[1].id)
        done(err)
      })
  })
})

describe('Create Project', () => {
  test('create project returns 201 and the project json', async (done) => {
    const u1 = await Util.createTestUser()
    const t1 = await Util.createTestTechnology()

    const project = {
      name: 'create cli name',
      ownerId: u1.id,
      teamLeadId: u1.id,
      principals: [
        { id: u1.id },
      ],
      technologies: [
        { id: t1.id },
      ],
    }
    request(app)
      .post(apiUrl)
      .send(project)
      .expect('Content-Type', /json/)
      .expect(201, (err, res) => {
        expect(err).toBeNull()
        Util.validateSchema(res.body, projectSchema)
        expect(res.body.id).not.toBeLessThan(1)
        expect(res.body.name).toEqual(project.name)
        expect(res.body.principals.length).toBe(1)
        expect(res.body.principals[0].id).toEqual(u1.id)
        expect(res.body.technologies.length).toBe(1)
        expect(res.body.technologies[0].id).toEqual(t1.id)
        done(err)
      })
  })

  test('create project with existing name fails and returns 422', async (done) => {
    const dbCli = await Util.createTestProject()
    const u1 = await Util.createTestUser()

    const project = {
      name: dbCli.name,
      ownerId: u1.id,
      teamLeadId: u1.id,
    }
    request(app)
      .post(apiUrl)
      .send(project)
      .expect('Content-Type', /json/)
      .expect(422, (err, res) => {
        console.log(err)
        done(err)
      })
  })
})

describe('Update Project', () => {
  test('update project returns 200 and the project json', async (done) => {
    const dbCli = await Util.createTestProject()
    const u1 = await Util.createTestUser()
    const t1 = await Util.createTestTechnology()

    const json = {
      name: 'new updated cli name',
      principals: [
        { id: u1.id },
      ],
      technologies: [
        { id: t1.id },
      ],
    }

    request(app)
      .put(`${apiUrl}/${dbCli.id}`)
      .send(json)
      .expect('Content-Type', /json/)
      .expect(200, (err, res) => {
        expect(err).toBeNull()
        Util.validateSchema(res.body, projectSchema)
        expect(res.body.id).toEqual(dbCli.id)
        expect(res.body.name).toEqual(json.name)
        expect(res.body.principals.length).toBe(1)
        expect(res.body.principals[0].id).toEqual(u1.id)
        expect(res.body.technologies.length).toBe(1)
        expect(res.body.technologies[0].id).toEqual(t1.id)
        done(err)
      })
  })
})

describe('Delete Project', () => {
  test('delete project returns 200 and the project is not returned ', async (done) => {
    const dbCli = await Util.createTestProject()

    const res = await request(app)
      .delete(`${apiUrl}/${dbCli.id}`)
    expect(res.statusCode).toBe(200)

    const res2 = await request(app)
      .get(`${apiUrl}/${dbCli.id}`)
    expect(res2.statusCode).toBe(404)

    done()
  })
})
