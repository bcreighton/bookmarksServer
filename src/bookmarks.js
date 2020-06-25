require('dotenv').config()
const knex = require('knex')
const BookmarksService = require('./bookmarksService')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
})

console.log(BookmarksService.getAllBookmarks())