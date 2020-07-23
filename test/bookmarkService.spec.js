const { expect } = require('chai')

const BookmarkService = require('../src/BookmarkService')
const knex = require('knex')

describe('Bookmarks service object', () => {

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
  afterEach(() => db('bookmarktable').truncate())

  after(() => db.destroy())

  // Populated database tests
  context(`Given 'bookmarktable' has data`, () => {

    beforeEach(() => {
      return db
        .into('bookmarktable')
        .insert(testBookmarks)
    })

    it(`getAllBookmarks() resolves all bookmarks from 'bookmarkstable' table`, () => {
      return BookmarkService.getAllBookmarks(db)
        .then(actual => {
          expect(actual).to.eql(testBookmarks)
        })
    })

    it(`getById() resolves a bookmark by id from 'bookmarktable' table`, () => {
      const secondId = 2
      const secondTestBookmark = testBookmarks[secondId - 1]

      return BookmarkService.getById(db, secondId)
        .then(actual => {
          expect(actual).to.eql({
            id: secondId,
            title: secondTestBookmark.title,
            url: secondTestBookmark.url,
            description: secondTestBookmark.description,
            rating: secondTestBookmark.rating,
          })
        })
    })

    it(`deleteBookmark() removes a bookmark by id from 'bookmarktable' table`, () => {
      const bookmarkId = 2

      return BookmarkService.deleteBookmark(db, bookmarkId)
        .then(() => BookmarkService.getAllBookmarks(db))
        .then(allBookmarks => {
          // copy the test bookmarks array withou tthe 'delete' bookmark
          const expected = testBookmarks.filter(bookmark => bookmark.id !== bookmarkId)

          expect(allBookmarks).to.eql(expected)
        })
    })

    it(`updateBookmark() updates a bookmark from the 'bookmarktable' table`, () => {
      const idOfBookmarkToUpdate = 2
      const newBookmarkData = {
        title: 'updated title',
        url: 'updataed url',
        description: 'updated description',
        rating: 1
      }

      return BookmarkService.updateBookmark(db, idOfBookmarkToUpdate, newBookmarkData)
        .then(() => BookmarkService.getById(db, idOfBookmarkToUpdate))
        .then(bookmark => {
          expect(bookmark).to.eql({
            id: idOfBookmarkToUpdate,
            ...newBookmarkData,
          })
        })
    })
  })

  // Empty database tests
  context(`Given 'bookmarkstable' has no data`, () => {
    it(`getAllBookmarks() resolves to empty array`, () => {
      return BookmarkService.getAllBookmarks(db)
        .then(actual => {
          expect(actual).to.eql([])
        })
    })

    it(`insertBookmark() inserts a new bookmark and resolvs the new bookmark with an 'id'`, () => {
      const newBookmark = {
        title: "Yahoo",
        url: "http://www.yahoo.com",
        description: "Search...",
        rating: 1
      }

      return BookmarkService.insertBookmark(db, newBookmark)
        .then(actual => {
          expect(actual).to.eql({
            id: 1,
            title: newBookmark.title,
            url: newBookmark.url,
            description: newBookmark.description,
            rating: newBookmark.rating,
          })
        })
    })
  })
})