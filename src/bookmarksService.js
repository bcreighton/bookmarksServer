const Knex = require('knex');

const BookmarksService = {
  getAllBookmarks(knex) {
    return knex.select('*').from('bookmarktable')
  }
}

module.exports = BookmarksService;