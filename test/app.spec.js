const app = require('../src/app')

describe('App', () => {
  it('GET / responds with 200 containing "Hello, bookmarks!"', () => {
    return supertest(app)
      .get('/')
      .expect(200, 'Hello, bookmarks!')
  })
})