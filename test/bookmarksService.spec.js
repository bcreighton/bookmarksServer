const { expect } = require('chai')

const BookmarksService = require('../src/bookmarksService')
const knex = require('knex')

describe.only('Bookmarks service object', () => {

  let db
  let testBookmarks = [
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

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
  })

  before(() => db('bookmarktable').truncate())

  before(() => {
    return db
      .into('bookmarktable')
      .insert(testBookmarks)
  })

  after(() => db.destroy())

  context(`getAllBookmarks()`, () => {
    it(`resolves all bookmarks from 'bookmarktable' table`, () => {
      // test that BookmarksService.getAllBookmarks gets data from the table
      return BookmarksService.getAllBookmarks(db)
        .then(actual => {
          expect(actual).to.eql(testBookmarks)
        })
    })
  })
})