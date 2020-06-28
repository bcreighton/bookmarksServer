const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app1')
const supertest = require('supertest')
const { makeBookmarksArray } = require('./bookmarks.fixture')

describe.only('Bookmarks Endpoints', () => {
  let db
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })

    app.set('db', db)
  })

  after('disconnect form db', () => db.destroy())

  before('clean the table', () => db('bookmarktable').truncate())

  afterEach('cleanup', () => db('bookmarktable').truncate())

  describe(`GET /bookmarks`, () => {

    context(`Given no bookmarks`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/bookmarks')
          .set('Authorization', 'Bearer 3eafe11c-b90f-11ea-b3de-0242ac130004')
          .expect(200, [])
      })
    })

    context(`Given there are bookmarks in the database`, () => {
      const testBookmarks = makeBookmarksArray()

      beforeEach('insert bookmarks', () => {
        return db
          .into('bookmarktable')
          .insert(testBookmarks)
      })

      it(`responds with a 200 and all the bookmarks`, () => {
        return supertest(app)
          .get('/bookmarks')
          .set('Authorization', 'Bearer 3eafe11c-b90f-11ea-b3de-0242ac130004')
          .expect(200, testBookmarks)
      })
    })
  })

  describe(`GET /bookmarks/:bookmark_id`, () => {

    context(`Given no bookmarks`, () => {
      it(`responds with 404`, () => {
        const bookmarkId = 123456

        return supertest(app)
          .get(`/bookmarks/${bookmarkId}`)
          .set('Authorization', 'Bearer 3eafe11c-b90f-11ea-b3de-0242ac130004')
          .expect(404, { error: { message: `Bookmark does not exist` } })
      })
    })
    context(`Given there are bookmarks in the database`, () => {
      const testBookmarks = makeBookmarksArray()

      beforeEach('insert bookmarks', () => {
        return db
          .into('bookmarktable')
          .insert(testBookmarks)
      })

      it(`GET /bookmarks/:bookmark_id response with 200 and returns the specified bookmark`, () => {
        const bookmarkId = 2
        const expectedBookmark = testBookmarks[bookmarkId - 1]
        return supertest(app)
          .get(`/bookmarks/${bookmarkId}`)
          .set('Authorization', 'Bearer 3eafe11c-b90f-11ea-b3de-0242ac130004')
          .expect(200, expectedBookmark)
      })
    })
  })
})