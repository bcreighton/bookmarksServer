const express = require('express')
const { v4: uuid } = require('uuid')
const logger = require('../logger')
const bookmarks = require('../store')

const bookmarkRouter = express.Router()
const bodyParser = express.json()

bookmarkRouter
  .route('/bookmark')
  .get((req, res) => {
    res
      .json(bookmarks)
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
  .route('/bookmark/:id')
  .get((req, res) => {
    const { id } = req.params
    const bookmark = bookmarks.find(b => b.id == id)

    // validate the bookmark exists in current data
    if (!bookmark) {
      logger.error(`Bookmark with ID:${id} not found.`)
      return res
        .status(404)
        .send('Bookmark Not Found')
    }

    res
      .json(bookmark)
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