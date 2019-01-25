const request = require('supertest')
const db = require('../../models')
const app = require('../../index')
const Util = require('../testUtil.js')

const apiUrlClients = '/api/clients'
const reviewSchema = {
  id: '',
  reviewDate: '',
  reviewerId: '',
  clientId: '',
  directives: '',
  link: '',
  score: '',
  trend: '',
}

const directiveSchema = {
  id: '',
  title: '',
  subtitle: '',
  ReviewDirective: '',
}

beforeAll(async () => {
  // Code that runs before every test goes here
})

afterAll(() => {

})

describe('List Reviews for a client', () => {
  test('respond with json containing a list of all reviews', async (done) => {
    const dbReview = await Util.createTestReview()
    expect(dbReview.id).toBeDefined()

    request(app)
      .get(`${apiUrlClients}/${dbReview.clientId}/reviews`)
      .expect('Content-Type', /json/)
      .expect(200, (err, res) => {
        expect(err).toBeNull()
        Util.validateSchema(res.body, { count: '', rows: '' })
        const list = res.body.rows
        expect(res.body.count).not.toBeLessThan(1)
        expect(list.length).not.toBeLessThan(1)
        Util.validateSchema(list[0], reviewSchema)
        const result = list.find(cli => cli.id === dbReview.id)
        expect(result).not.toBeUndefined()
        done(err)
      })
  })
})

describe('View Review', () => {
  test('respond with json with the review', async (done) => {
    const dbReview = await Util.createTestReview()
    const directives = await dbReview.getDirectives()


    request(app)
      .get(`${apiUrlClients}/${dbReview.clientId}/reviews/${dbReview.id}`)
      .expect('Content-Type', /json/)
      .expect(200, (err, res) => {
        expect(err).toBeNull()
        Util.validateSchema(res.body, reviewSchema)
        expect(res.body.id).toEqual(dbReview.id)
        expect(res.body.clientId).toEqual(dbReview.clientId)

        expect(res.body.directives.length).toBe(3)
        Util.validateSchema(res.body.directives[0], directiveSchema)
        expect(res.body.directives[0].id).toEqual(directives[0].id)
        expect(res.body.directives[1].id).toEqual(directives[1].id)

        Util.validateSchema(res.body.directives[0], directiveSchema)
        expect(res.body.directives[0].ReviewDirective.compliant)
          .toEqual(directives[0].ReviewDirective.compliant)

        done(err)
      })
  })
})

describe('View Review by Link', () => {
  test('respond with json with the review', async (done) => {
    const dbReview = await Util.createTestReview()

    request(app)
      .get(`/api/reviews/${dbReview.link}`)
      .expect('Content-Type', /json/)
      .expect(200, async (err, res) => {
        expect(err).toBeNull()
        Util.validateSchema(res.body, reviewSchema)
        expect(res.body.id).toEqual(dbReview.id)
        expect(res.body.clientId).toEqual(dbReview.clientId)
        expect(res.body.directives.length).toBe(3)

        const res2 = await request(app)
          .get('/review/wrongLink')
        expect(res2.statusCode).toBe(404)

        done(err)
      })
  })
})

describe('Create Review', () => {
  test('create review returns 201 and the review json', async (done) => {
    const u1 = await Util.createTestUser()
    const c1 = await Util.createTestClient()
    const d1 = await Util.createTestDirective()

    const review = {
      reviewerId: u1.id,
      clientId: c1.id,
      reviewDate: new Date(),
      directives: [
        {
          id: d1.id,
          compliant: true,
          notes: 'Just a note',
        },
      ],
    }
    request(app)
      .post(`${apiUrlClients}/${c1.id}/reviews`)
      .send(review)
      .expect('Content-Type', /json/)
      .expect(201, (err, res) => {
        expect(err).toBeNull()
        Util.validateSchema(res.body, reviewSchema)
        expect(res.body.id).not.toBeLessThan(1)
        expect(res.body.clientId).toEqual(c1.id)
        expect(parseInt(res.body.score, 10)).toBe(5)
        expect(res.body.directives.length).toBe(1)
        expect(res.body.directives[0].id).toEqual(d1.id)
        Util.validateSchema(res.body.directives[0], directiveSchema)
        expect(res.body.directives[0].ReviewDirective.compliant).toBeTruthy()
        expect(res.body.directives[0].ReviewDirective.notes).toEqual('Just a note')

        done(err)
      })
  })
})

describe('Update Review', () => {
  test('update review returns 200 and the review json', async (done) => {
    const dbReview = await Util.createTestReview()
    const d1 = await Util.createTestDirective()
    const u1 = await Util.createTestUser()

    const json = {
      reviewerId: u1.id,
      directives: [
        {
          id: d1.id,
          compliant: true,
          notes: 'Updated note',
        },
      ],
    }

    request(app)
      .put(`${apiUrlClients}/${dbReview.clientId}/reviews/${dbReview.id}`)
      .send(json)
      .expect('Content-Type', /json/)
      .expect(200, (err, res) => {
        expect(err).toBeNull()
        Util.validateSchema(res.body, reviewSchema)
        expect(res.body.id).toEqual(dbReview.id)
        expect(res.body.reviewerId).toEqual(u1.id)
        expect(res.body.directives.length).toBe(1)
        expect(res.body.directives[0].id).toEqual(d1.id)
        expect(res.body.directives[0].ReviewDirective.compliant).toBeTruthy()
        expect(res.body.directives[0].ReviewDirective.notes).toEqual('Updated note')

        done(err)
      })
  })
})

describe('Delete Review', () => {
  test('delete review returns 200 and the review is not returned ', async (done) => {
    const dbReview = await Util.createTestReview()

    const res = await request(app)
      .delete(`${apiUrlClients}/${dbReview.clientId}/reviews/${dbReview.id}`)
    expect(res.statusCode).toBe(200)

    const res2 = await request(app)
      .delete(`${apiUrlClients}/${dbReview.clientId}/reviews/${dbReview.id}`)
    expect(res2.statusCode).toBe(404)

    done()
  })
})
