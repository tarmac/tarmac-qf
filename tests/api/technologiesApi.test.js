const request = require('supertest')
const db = require('../../models')
const app = require('../../index')
const Util = require('../testUtil.js')

const apiUrl = '/api/technologies'
const technologySchema = {
  id: '',
  name: '',
  description: '',
  organizationId: '',
}

beforeAll(async () => {
  // Code that runs before every test goes here
})

afterAll(() => {

})

describe('List Technologies', () => {
  test('respond with json containing a list of all technologies', async (done) => {
    const dbTech = await Util.createTestTechnology()
    expect(dbTech.id).toBeDefined()

    request(app)
      .get(`${apiUrl}?limit=${Number.MAX_SAFE_INTEGER}`)
      .expect('Content-Type', /json/)
      .expect(200, (err, res) => {
        expect(err).toBeNull()
        Util.validateSchema(res.body, { count: '', rows: '' })
        const list = res.body.rows
        expect(res.body.count).not.toBeLessThan(1)
        expect(list.length).not.toBeLessThan(1)
        Util.validateSchema(list[0], technologySchema)
        const result = list.find(obj => obj.id === dbTech.id)
        expect(result).not.toBeUndefined()
        done(err)
      })
  })
})

describe('View Technology', () => {
  test('respond with json with the technology', async (done) => {
    const dbTech = await Util.createTestTechnology()

    request(app)
      .get(`${apiUrl}/${dbTech.id}`)
      .expect('Content-Type', /json/)
      .expect(200, (err, res) => {
        expect(err).toBeNull()
        Util.validateSchema(res.body, technologySchema)
        expect(res.body.id).toEqual(dbTech.id)
        expect(res.body.name).toEqual(dbTech.name)
        done(err)
      })
  })
})

describe('Create Technology', () => {
  test('create technology returns 201 and the technology json', async (done) => {
    const tech = {
      name: 'create tech name',
    }
    request(app)
      .post(apiUrl)
      .send(tech)
      .expect('Content-Type', /json/)
      .expect(201, (err, res) => {
        expect(err).toBeNull()
        Util.validateSchema(res.body, technologySchema)
        expect(res.body.id).not.toBeLessThan(1)
        expect(res.body.name).toEqual(tech.name)
        done(err)
      })
  })

  test('create technology with existing name fails and returns 422', async (done) => {
    const dbTech = await Util.createTestTechnology()

    const tech = {
      name: dbTech.name,
    }
    request(app)
      .post(apiUrl)
      .send(tech)
      .expect('Content-Type', /json/)
      .expect(422, (err, res) => {
        console.log(err)
        done(err)
      })
  })
})

describe('Update Technology', () => {
  test('update technology returns 200 and the technology json', async (done) => {
    const dbTech = await Util.createTestTechnology()

    const json = {
      name: 'new updated tech name',
    }

    request(app)
      .put(`${apiUrl}/${dbTech.id}`)
      .send(json)
      .expect('Content-Type', /json/)
      .expect(200, (err, res) => {
        expect(err).toBeNull()
        Util.validateSchema(res.body, technologySchema)
        expect(res.body.id).toEqual(dbTech.id)
        expect(res.body.name).toEqual(json.name)
        done(err)
      })
  })
})

describe('Delete Technology', () => {
  test('delete technology returns 200 and the technology is not returned ', async (done) => {
    const dbTech = await Util.createTestTechnology()

    const res = await request(app)
      .delete(`${apiUrl}/${dbTech.id}`)
    expect(res.statusCode).toBe(200)

    const res2 = await request(app)
      .get(`${apiUrl}/${dbTech.id}`)
    expect(res2.statusCode).toBe(404)

    done()
  })
})
