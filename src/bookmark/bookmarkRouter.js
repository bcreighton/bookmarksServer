const path = require('path')
const express = require('express')
const xss = require('xss')
const { v4: uuid } = require('uuid')
const logger = require('../logger')
const BookmarkService = require('../bookmarkService')

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
  .route('/api/bookmark')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    BookmarkService.getAllBookmarks(knexInstance)
      .then(bookmarks => {
        res.json(bookmarks.map(serializeBookmark))
      })
      .catch(next)
  })
  .post(bodyParser, (req, res, next) => {
    debugger
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

    BookmarkService.insertBookmark(
      req.app.get('db'),
      newBookmark
    )
      .then(bookmark => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${bookmark.id}`))
          .json(serializeBookmark(bookmark))
      })
      .catch(next)
  })

bookmarkRouter
  .route('/api/bookmark/:id')
  .all((req, res, next) => {
    BookmarkService.getById(
      req.app.get('db'),
      req.params.id
    )
      .then(bookmark => {
        if (!bookmark) {
          return res.status(404).json({
            error: { message: `Bookmark does not exist` }
          })
        }

        res.bookmark = bookmark // save the bookmark for the next middleware
        next() // call next to push to the next middleware
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json({
      id: res.bookmark.id,
      title: xss(res.bookmark.title),
      url: res.bookmark.url,
      rating: res.bookmark.rating,
      description: xss(res.bookmark.description)
    })
  })
  .delete((req, res, next) => {
    logger.info(`Bookmark with ID: ${req.params.id} deleted`)

    BookmarkService.deleteBookmark(
      req.app.get('db'),
      req.params.id
    )
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(bodyParser, (req, res, next) => {
    const { title, url, rating, description } = req.body
    const bookmarkToUpdate = { title, url, rating, description }

    const numberOfValues = Object.values(bookmarkToUpdate).filter(Boolean).length

    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'title', 'url', 'description', 'rating'`
        }
      })
    }

    BookmarkService.updateBookmark(
      req.app.get('db'),
      req.params.id,
      bookmarkToUpdate
    )
      .then(numRowsAffected =>
        res.status(204).end()
      )
      .catch(next)
  })

module.exports = bookmarkRouter