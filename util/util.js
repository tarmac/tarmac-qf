module.exports = {
  randomString(length = 10) {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i += 1) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
  },
  getOrgId(req) {
    // TODO once auth is implemented the org should be taken out of the current user
    return 1
  },
  // Converts [{"id": 2}, {"id: 3"}] to [2, 3]
  jsonObjectsToIdsArray(list) {
    return list.map(obj => obj.id)
  },
  mergeObject(obj, keys, fieldMap) {
    keys.forEach((key) => {
      if (fieldMap[key] !== undefined) {
        console.log(`${key}: ${fieldMap[key]}`)
        obj[key] = fieldMap[key]
      }
    })
    return obj
  },
}
