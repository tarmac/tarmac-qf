const request = require('supertest')
const db = require('../../models')
const app = require('../../index')
const Util = require('../testUtil.js')

const apiUrl = '/api/directives'
const directiveSchema = {
  id: '',
  title: '',
  subtitle: '',
  organizationId: '',
}

beforeAll(async () => {
  // Code that runs before every test goes here
})

afterAll(() => {

})

describe('List Directives', () => {
  test('respond with json containing a list of all directives', async (done) => {
    const dbDir = await Util.createTestDirective()
    expect(dbDir.id).toBeDefined()

    request(app)
      .get(`${apiUrl}?limit=${Number.MAX_SAFE_INTEGER}`)
      .expect('Content-Type', /json/)
      .expect(200, (err, res) => {
        expect(err).toBeNull()
        Util.validateSchema(res.body, { count: '', rows: '' })
        const list = res.body.rows
        expect(res.body.count).not.toBeLessThan(1)
        expect(list.length).not.toBeLessThan(1)
        Util.validateSchema(list[0], directiveSchema)
        const result = list.find(obj => obj.id === dbDir.id)
        expect(result).not.toBeUndefined()
        done(err)
      })
  })
})

describe('View Directive', () => {
  test('respond with json with the directive', async (done) => {
    const dbDir = await Util.createTestDirective()

    request(app)
      .get(`${apiUrl}/${dbDir.id}`)
      .expect(200, (err, res) => {
        console.log(err)
        expect(err).toBeNull()
        Util.validateSchema(res.body, directiveSchema)
        expect(res.body.id).toEqual(dbDir.id)
        expect(res.body.title).toEqual(dbDir.title)
        done(err)
      })
  })
})

describe('Create Directive', () => {
  test('create directive returns 201 and the directive json', async (done) => {
    const dir = {
      title: 'create dir title',
    }
    request(app)
      .post(apiUrl)
      .send(dir)
      .expect('Content-Type', /json/)
      .expect(201, (err, res) => {
        expect(err).toBeNull()
        Util.validateSchema(res.body, directiveSchema)
        expect(res.body.id).not.toBeLessThan(1)
        expect(res.body.title).toEqual(dir.title)
        done(err)
      })
  })
})

describe('Update Directive', () => {
  test('update directive returns 200 and the directive json', async (done) => {
    const dbDir = await Util.createTestDirective()

    const json = {
      title: 'new updated dir title',
    }

    request(app)
      .put(`${apiUrl}/${dbDir.id}`)
      .send(json)
      .expect('Content-Type', /json/)
      .expect(200, (err, res) => {
        expect(err).toBeNull()
        Util.validateSchema(res.body, directiveSchema)
        expect(res.body.id).toEqual(dbDir.id)
        expect(res.body.title).toEqual(json.title)
        done(err)
      })
  })
})

describe('Delete Directive', () => {
  test('delete directive returns 200 and the directive is not returned ', async (done) => {
    const dbDir = await Util.createTestDirective()

    const res = await request(app)
      .delete(`${apiUrl}/${dbDir.id}`)
    expect(res.statusCode).toBe(200)

    const res2 = await request(app)
      .get(`${apiUrl}/${dbDir.id}`)
    expect(res2.statusCode).toBe(404)

    done()
  })
})
