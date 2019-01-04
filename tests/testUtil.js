const assert = require('assert')
const db = require('../models')

const {
  User, Organization, Client, Technology, Directive, Review,
} = db

module.exports = {
  randomString(length = 10) {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i += 1) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
  },
  validateSchema(object, schema) {
    const objectKeys = Object.keys(object).sort()
    const schemaKeys = Object.keys(schema).sort()
    const msg = `objectKeys: [${objectKeys}] does not equals schemaKeys: [${schemaKeys}]`
    assert.equal(JSON.stringify(objectKeys), JSON.stringify(schemaKeys), msg)
  },
  async saveObjectWithoutField(obj, field, done) {
    obj[field] = null

    expect.assertions(3)
    try {
      await obj.validate()
    } catch (err) {
      expect(err.name).toEqual('SequelizeValidationError')
      expect(err.errors.length).toBe(1)
      expect(err.errors[0].path).toEqual(field)
      done()
    }
  },
  buildTestOrganization() {
    return Organization.build({
      name: this.randomString(),
      status: 'APPROVED',
      domains: [
        {
          domain: this.randomString(),
        },
      ],
    }, { include: ['domains'] })
  },
  async createTestOrganization() {
    return this.buildTestOrganization().save()
  },
  async buildTestUser() {
    const organization = await this.createTestOrganization()
    return User.build({
      name: this.randomString(),
      firstName: 'Alvaro',
      lastName: 'Scuccimarra',
      email: `${this.randomString()}@testuser.com`,
      password: this.randomString(),
      slackName: 'alvaro',
      organizationId: organization.id,
    })
  },
  async createTestUser() {
    const user = await this.buildTestUser()
    return user.save()
  },
  async buildTestClient() {
    const organization = await this.createTestOrganization()
    const user1 = await this.createTestUser()
    const user2 = await this.createTestUser()

    return Client.build({
      name: this.randomString(),
      pictureUrl: this.randomString(),
      slackInternalChannel: this.randomString(),
      slackClientChannel: this.randomString(),
      organizationId: organization.id,
      ownerId: user1.id,
      teamLeadId: user2.id,
    }, { })
  },
  async createTestClient() {
    const client = await this.buildTestClient()
    return client.save()
  },
  async buildTestTechnology() {
    const organization = await this.createTestOrganization()

    return Technology.build({
      name: this.randomString(),
      description: this.randomString(),
      organizationId: organization.id,
    }, { })
  },
  async createTestTechnology() {
    const tech = await this.buildTestTechnology()
    return tech.save()
  },
  async buildTestDirective() {
    const organization = await this.createTestOrganization()

    return Directive.build({
      description: this.randomString(),
      organizationId: organization.id,
    }, { })
  },
  async createTestDirective() {
    const dir = await this.buildTestDirective()
    return dir.save()
  },
  async buildTestReview() {
    const client = await this.createTestClient()

    return Review.build({
      score: 5,
      trend: 'UP',
      reviewDate: Date.now(),
      link: this.randomString(),
      clientId: client.id,
    }, { })
  },
  async createTestReview() {
    const review = await this.buildTestReview()
    return review.save()
  },
}
