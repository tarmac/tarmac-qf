const db = require('../models')
const Util = require('./testUtil.js')

const { User, Sequelize } = db

beforeAll(async () => {
  // Code that runs before every test goes here
})

afterAll(() => {
  db.sequelize.close().then(() => {
    console.log('Shut down gracefully')
  })
})

describe('User Model', () => {
  // Test required fields
  const requiredFields = ['firstName', 'lastName', 'email', 'password', 'slackName', 'organizationId']
  requiredFields.forEach((field) => {
    test(`User should require a  ${field}`, (done) => {
      saveUserWithoutField(field, done)
    })
  })

  test('Password must have at least 6 chars', async (done) => {
    const user = await Util.buildTestUser()
    user.password = '12345'

    try {
      await user.validate()
    } catch (err) {
      expect(err.name).toEqual('SequelizeValidationError')
      expect(err.errors.length).toBe(1)
      expect(err.errors[0].path).toEqual('password')
      expect(err.errors[0].validatorName).toEqual('len')
    }

    user.password = '123456'
    await user.validate()
    done()
  })

  test('User is saved OK with all the fields and password hashed', async (done) => {
    let user = await Util.buildTestUser()
    const { password } = user

    user = await user.save()
    expect(user.id).toBeDefined()

    const dbUser = await User.findOne({ where: { id: user.id } })
    requiredFields.forEach((field) => {
      if (field !== 'password') {
        expect(dbUser.field).toEqual(user.field)
      }
    })

    expect(password).not.toEqual(dbUser.password)
    expect(dbUser.isValidPassword(password)).toBeTruthy()
    done()
  })

  test('User bulk create should hash the passwords', async (done) => {
    const user1 = await Util.buildTestUser()
    const user2 = await Util.buildTestUser()

    const pass1 = user1.password
    const pass2 = user2.password
    const instances = [user1.dataValues, user2.dataValues]

    await User.bulkCreate(instances, { validate: true, individualHooks: true })

    const dbUser1 = await User.findOne({ where: { email: user1.email } })
    const dbUser2 = await User.findOne({ where: { email: user2.email } })

    expect(dbUser1.password).not.toEqual(pass1)
    expect(dbUser2.password).not.toEqual(pass2)

    expect(dbUser1.isValidPassword(pass1)).toBeTruthy()
    expect(dbUser2.isValidPassword(pass2)).toBeTruthy()
    done()
  })
})

async function saveUserWithoutField(field, done) {
  const user = await Util.buildTestUser()
  user[field] = null

  expect.assertions(3)
  try {
    await user.validate()
  } catch (err) {
    expect(err.name).toEqual('SequelizeValidationError')
    expect(err.errors.length).toBe(1)
    expect(err.errors[0].path).toEqual(field)
    done()
  }
}
