const db = require('../../models')

const { Review, Client } = db
const Util = require('../testUtil.js')

beforeAll(async () => {
  // Code that runs before every test goes here
})

afterAll(() => {
  // db.sequelize.close().then(() => console.log('Shut down gracefully'))
})

describe('Review Model', () => {
  const requiredFields = ['clientId']
  requiredFields.forEach((field) => {
    test(`Review should require a ${field}`, async (done) => {
      Util.saveObjectWithoutField(await Util.buildTestReview(), field, done)
    })
  })

  test('Review is saved OK with all the fields and directives', async (done) => {
    const review = await Util.createTestReview()
    expect(review.id).toBeDefined()
    let dbReview = await Review.findOne({ where: { id: review.id } })
    requiredFields.forEach((field) => {
      expect(dbReview.field).toEqual(review.field)
    })
    const dir1 = await Util.createTestDirective()
    const dir2 = await Util.createTestDirective()
    await review.addDirectives(dir1, { through: { notes: 'A note', compliant: true } })
    await review.addDirectives(dir2, { through: { notes: 'Other note', compliant: false } })
    await review.save()

    dbReview = await Review.findOne({
      where: {
        id: review.id,
      },
      include: [{
        model: db.Directive,
        as: 'directives',
      }],
    })
    const directives = await dbReview.getDirectives()

    expect(directives.length).toBe(2)
    expect(directives.map(d => d.id).sort()).toEqual([dir1.id, dir2.id].sort())

    done()
  })
})
