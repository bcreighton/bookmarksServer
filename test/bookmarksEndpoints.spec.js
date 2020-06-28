const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app1')
const supertest = require('supertest')

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

  context(`Given 'bookmarktable' has data`, () => {
    const testBookmarks = [
      {
        id: 1,
        title: 'Google',
        url: 'http://www.google.com',
        description: 'Internet-related services and products.',
        rating: 3
      },
      {
        id: 2,
        title: 'Thinkful',
        url: 'http://www.thinkful.com',
        description: '1-on-1 learning to accelerate your way to a new high-growth tech career!',
        rating: 5
      },
      {
        id: 3,
        title: 'Github',
        url: 'http://www.github.com',
        description: 'brings together the world\'s largest community of developers.',
        rating: 4
      }
    ]

    beforeEach('insert bookmarks', () => {
      return db
        .into('bookmarktable')
        .insert(testBookmarks)
    })

    it(`GET /bookmarks responds with a 200 and all the bookmarks`, () => {
      return supertest(app)
        .get('/bookmarks')
        .set('Authorization', 'Bearer 3eafe11c-b90f-11ea-b3de-0242ac130004')
        .expect(200, testBookmarks)
    })
  })
})