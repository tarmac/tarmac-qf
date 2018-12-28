const db = require('../models')

const { User, Organization } = db

module.exports = {
  randomString(length = 10) {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i += 1) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
  },
  buildTestOrganization() {
    return Organization.build({
      name: this.randomString(),
      status: 'APPROVED',
    })
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
    return this.buildTestUser().save()
  },
}
