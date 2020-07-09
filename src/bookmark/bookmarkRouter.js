const express = require('express')
const xss = require('xss')
const { v4: uuid } = require('uuid')
const logger = require('../logger')
const BookmarksService = require('../bookmarksService')

const bookmarkRouter = express.Router()
const bodyParser = express.json()

const serializeBookmark = bookmark => ({
  id: bookmark.id,
  title: xss(bookmark.title),
  url: bookmark.url,
  rating: bookmark.rating,
  description: xss(bookmark.description),
})

bookmarkRouter
  .route('/bookmarks')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    BookmarksService.getAllBookmarks(knexInstance)
      .then(bookmarks => {
        res.json(bookmarks.map(serializeBookmark))
      })
      .catch(next)
  })
  .post(bodyParser, (req, res, next) => {
    const { title, url, rating = 1, description = '' } = req.body
    const newBookmark = { title, url, rating, description }

    for (const [key, value] of Object.entries(newBookmark)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    if (rating < 1 || rating > 5) {
      logger.error('Raiting must be between 1 and 5')
      return res
        .status(400).json({
          error: { message: `'${rating}' is an invalid rating` }
        })
    }

    // LOG CREATION OF NEW BOOKMARK
    logger.info(`Bookmark with id ${req.params.id} created`)

    BookmarksService.insertBookmark(
      req.app.get('db'),
      newBookmark
    )
      .then(bookmark => {
        res
          .status(201)
          .location(`/bookmarks/${bookmark.id}`)
          .json(serializeBookmark(bookmark))
      })
      .catch(next)
  })

bookmarkRouter
  .route('/bookmarks/:id')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')

    BookmarksService.getById(knexInstance, req.params.id)
      .then(bookmark => {
        if (!bookmark) {
          return res.status(404).json({
            error: { message: `Bookmark does not exist` }
          })
        }
        res.json({
          id: bookmark.id,
          title: xss(bookmark.title),
          url: bookmark.url,
          rating: bookmark.rating,
          description: xss(bookmark.description)
        })
      })
      .catch(next)
  })
  .delete((req, res) => {
    const { id } = req.params

    const bookmarkIndex = bookmarks.findIndex(bI => bI.id == id)

    // VERIFY BOOKMARK ID EXISTS IN CURRENT DATA
    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with ID:${id} not found.`)
      return res
        .status(404)
        .send('Not Found')
    }

    // REMOVE BOOKMARK BY ID
    bookmarks.splice(bookmarkIndex, 1)

    logger.info(`Bookmark with ID: ${id} deleted`)
    res
      .status(204)
      .end()
  })

module.exports = bookmarkRouter