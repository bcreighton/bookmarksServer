const express = require('express')
const { v4: uuid } = require('uuid')
const logger = require('../logger')
const bookmarks = require('../store')
const BookmarksService = require('../bookmarksService')

const bookmarkRouter = express.Router()
const bodyParser = express.json()

bookmarkRouter
  .route('/bookmarks')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    BookmarksService.getAllBookmarks(knexInstance)
      .then(bookmarks => {
        res.json(bookmarks)
      })
      .catch(next)
  })
  .post(bodyParser, (req, res) => {
    const { title, url, rating = 1, desc = '' } = req.body

    if (!title) {
      logger.error('Title is required')
      return res
        .status(400)
        .send('Invalid data')
    }

    if (!url) {
      logger.error('URL is required')
      return res
        .status(400)
        .send('Invalid data')
    }

    if (rating < 1 || rating > 5) {
      logger.error('Raiting must be between 1 and 5')
      return res
        .status(400)
        .send('Invalid data')
    }

    // GET NEW ID
    const id = uuid()

    const bookmark = {
      id,
      title,
      url,
      rating,
      desc,
    }

    //ADD NEW BOOKMARK TO DATA
    bookmarks.push(bookmark)

    // LOG CREATION OF NEW BOOKMARK
    logger.info(`Bookmark with id ${id} created`)

    res
      .status(201)
      .location(`http://localhost:8000/bookmark/${id}`)
      .json(bookmark)
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
        res.json(bookmark)
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