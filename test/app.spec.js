const app = require('../src/app')

describe('App', () => {
  it('GET / responds with 200 containing "Hello, bookmarks!"', () => {
    return supertest(app)
      .get('/')
      .set('Authorization', 'Bearer e6848008-9534-4836-8fa1-65e042e4c11f')
      .expect(200, 'Hello, bookmarks!')
  })
})