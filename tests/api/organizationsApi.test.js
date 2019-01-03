const request = require('supertest')
const db = require('../../models')
const app = require('../../index')
const Util = require('../testUtil.js')

const apiUrl = '/api/organizations'
const organizationSchema = {
  id: '',
  name: '',
  domains: '',
  status: '',
}

beforeAll(async () => {
  // Code that runs before every test goes here
})

afterAll(() => {
  // db.sequelize.close().then(() => console.log('Shut down gracefully'))
})

describe('List Organizations', () => {
  test('respond with json containing a list of all organizations', async (done) => {
    const dbOrg = await Util.createTestOrganization()

    request(app)
      .get(apiUrl)
      .expect('Content-Type', /json/)
      .expect(200, (err, res) => {
        expect(err).toBeNull()
        Util.validateSchema(res.body, { count: '', rows: '' })
        const list = res.body.rows
        expect(res.body.count).not.toBeLessThan(1)
        expect(list.length).not.toBeLessThan(1)
        Util.validateSchema(list[0], organizationSchema)
        const result = list.find(org => org.id === dbOrg.id)
        expect(result).not.toBeUndefined()
        done(err)
      })
  })
})

describe('View Organization', () => {
  test('respond with json with the organization', async (done) => {
    const dbOrg = await Util.createTestOrganization()

    request(app)
      .get(`${apiUrl}/${dbOrg.id}`)
      .expect('Content-Type', /json/)
      .expect(200, (err, res) => {
        expect(err).toBeNull()
        Util.validateSchema(res.body, organizationSchema)
        expect(res.body.id).toEqual(dbOrg.id)
        expect(res.body.name).toEqual(dbOrg.name)
        expect(res.body.domains.length).toBe(1)
        expect(res.body.domains[0].domain).toEqual(dbOrg.domains[0].domain)
        done(err)
      })
  })
})

describe('Create Organization', () => {
  test('create organization returns 201 and the organization json', async (done) => {
    const organization = {
      name: 'Create org name',
      domains: [
        {
          domain: 'createorg.com',
        },
      ],
    }
    request(app)
      .post(apiUrl)
      .send(organization)
      .expect('Content-Type', /json/)
      .expect(201, (err, res) => {
        expect(err).toBeNull()
        Util.validateSchema(res.body, organizationSchema)
        expect(res.body.id).not.toBeLessThan(1)
        expect(res.body.name).toEqual(organization.name)
        expect(res.body.domains.length).toBe(1)
        expect(res.body.domains[0].id).not.toBeLessThan(1)
        expect(res.body.domains[0].domain).toEqual(organization.domains[0].domain)
        done(err)
      })
  })

  test('create organization with existing name fails and returns 422', async (done) => {
    const dbOrg = await Util.createTestOrganization()

    const organization = {
      name: dbOrg.name,
      domains: [
        {
          domain: 'createorgnamefails.com',
        },
      ],
    }
    request(app)
      .post(apiUrl)
      .send(organization)
      .expect('Content-Type', /json/)
      .expect(422, (err, res) => {
        console.log(err)
        done(err)
      })
  })

  describe('Update Organization', () => {
    test('update organization returns 200 and the organization json', async (done) => {
      const dbOrg = await Util.createTestOrganization()
      const json = { name: 'new updated org name' }

      request(app)
        .put(`${apiUrl}/${dbOrg.id}`)
        .send(json)
        .expect('Content-Type', /json/)
        .expect(200, (err, res) => {
          expect(err).toBeNull()
          Util.validateSchema(res.body, organizationSchema)
          expect(res.body.id).toEqual(dbOrg.id)
          expect(res.body.name).toEqual(json.name)
          done(err)
        })
    })
  })

  describe('Delete Organization', () => {
    test('delete organization returns 200 and the organization is not returned ', async (done) => {
      const dbOrg = await Util.createTestOrganization()

      const res = await request(app)
        .delete(`${apiUrl}/${dbOrg.id}`)
      expect(res.statusCode).toBe(200)

      const res2 = await request(app)
        .get(`${apiUrl}/${dbOrg.id}`)
      expect(res2.statusCode).toBe(404)

      done()
    })
  })
})
