const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const supertest = require('supertest')
const { makeBookmarksArray, makeMaliciousBookmark } = require('./bookmarks.fixture')

describe('Bookmarks Endpoints', () => {
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
          .set('Authorization', 'Bearer e6848008-9534-4836-8fa1-65e042e4c11f')
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
          .set('Authorization', 'Bearer e6848008-9534-4836-8fa1-65e042e4c11f')
          .expect(200, testBookmarks)
      })
    })

    context(`Given an XSS attack bookmark`, () => {
      const { maliciousBookmark, expectedBookmark } = makeMaliciousBookmark()

      beforeEach('insert malicious article', () => {
        return db
          .into('bookmarktable')
          .insert([maliciousBookmark])
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get('/bookmarks')
          .set('Authorization', 'Bearer e6848008-9534-4836-8fa1-65e042e4c11f')
          .expect(200)
          .expect(res => {
            expect(res.body[0].title).to.eql(expectedBookmark.title)
            expect(res.body.description).to.eql(expectedBookmark.describe)
          })
      })
    })
  })

  describe(`GET /bookmarks/:bookmark_id`, () => {

    context(`Given no bookmarks`, () => {
      it(`responds with 404`, () => {
        const bookmarkId = 123456

        return supertest(app)
          .get(`/bookmarks/${bookmarkId}`)
          .set('Authorization', 'Bearer e6848008-9534-4836-8fa1-65e042e4c11f')
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
          .set('Authorization', 'Bearer e6848008-9534-4836-8fa1-65e042e4c11f')
          .expect(200, expectedBookmark)
      })
    })

    context(`Given an XSS attack bookmark`, () => {
      const { maliciousBookmark, expectedBookmark } = makeMaliciousBookmark()

      beforeEach('insert malicious bookmark', () => {
        return db
          .into('bookmarktable')
          .insert([maliciousBookmark])
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/bookmarks/${maliciousBookmark.id}`)
          .set('Authorization', 'Bearer e6848008-9534-4836-8fa1-65e042e4c11f')
          .expect(200)
          .expect(res => {
            expect(res.body.title).to.eql(expectedBookmark.title)
            expect(res.body.description).to.eql(expectedBookmark.description)
          })
      })
    })
  })

  describe(`POST /bookmarks`, () => {
    it(`creates a bookmark, responding with a 201 and the new bookmark`, () => {

      const newBookmark = {
        title: 'Test new bookmark',
        url: 'http://www.testurl.com',
        description: 'Test new bookmark description...',
        rating: 3
      }

      return supertest(app)
        .post('/bookmarks')
        .set('Authorization', 'Bearer e6848008-9534-4836-8fa1-65e042e4c11f')
        .send(newBookmark)
        .expect(201)
        .expect(res => {
          expect(res.body.title).to.eql(newBookmark.title)
          expect(res.body.url).to.eql(newBookmark.url)
          expect(res.body.description).to.eql(newBookmark.description)
          expect(res.body.rating).to.eql(newBookmark.rating)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/bookmarks/${res.body.id}`)
        })
        .then(postRes => {
          supertest(app)
            .get(`/bookmarks/${postRes.body.id}`)
            .expect(postRes.body)
        })
    })

    const requiredFields = ['title', 'url']

    requiredFields.forEach(requiredField => {
      const newBookmark = {
        title: 'Test new bookmark',
        url: 'http://www.testurl.com'
      }

      it(`responds with 400 and an error message when the '${requiredField}' is missing`, () => {
        delete newBookmark[requiredField]

        return supertest(app)
          .post('/bookmarks')
          .set('Authorization', 'Bearer e6848008-9534-4836-8fa1-65e042e4c11f')
          .send(newBookmark)
          .expect(400, {
            error: { message: `Missing '${requiredField}' in request body` }
          })
      })
    })

    const ratings = [0, 6]

    ratings.forEach(rating => {
      const newBookmark = {
        title: 'Test new bookmark',
        url: 'http://www.testurl.com',
        rating
      }

      it(`responds with 400 and an error message when rating is not between 1 and 5; rating=${rating}`, () => {
        return supertest(app)
          .post('/bookmarks')
          .set('Authorization', 'Bearer e6848008-9534-4836-8fa1-65e042e4c11f')
          .send(newBookmark)
          .expect(400, {
            error: { message: `'${rating}' is an invalid rating` }
          })
      })
    })

    it('removes XSS attack content from response', () => {
      const { maliciousBookmark, expectedBookmark } = makeMaliciousBookmark()

      return supertest(app)
        .post('/bookmarks')
        .set('Authorization', 'Bearer e6848008-9534-4836-8fa1-65e042e4c11f')
        .send(maliciousBookmark)
        .expect(201)
        .expect(res => {
          expect(res.body.title).to.eql(expectedBookmark.title)
          expect(res.body.description).to.eql(expectedBookmark.description)
        })
    })
  })

  describe(`DELETE /bookmarks/:bookmark_id`, () => {
    context(`Given there are bookmarks in the database`, () => {
      const testBookmarks = makeBookmarksArray()

      beforeEach(`insert bookmarks`, () => {
        return db
          .into('bookmarktable')
          .insert(testBookmarks)
      })

      it(`responds with 204 and removes the bookmark`, () => {
        const idToRemove = 2
        const expectedBookmarks = testBookmarks.filter(bookmark => bookmark.id !== idToRemove)

        return supertest(app)
          .delete(`/bookmarks/${idToRemove}`)
          .set('Authorization', 'Bearer e6848008-9534-4836-8fa1-65e042e4c11f')
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/bookmarks`)
              .set('Authorization', 'Bearer e6848008-9534-4836-8fa1-65e042e4c11f')
              .expect(expectedBookmarks)
          )
      })
    })
  })
})