const knex = require('knex');

const BookmarkService = {
  getAllBookmarks(knex) {
    return knex.select('*').from('bookmarktable')
  },

  // CREATE
  insertBookmark(knex, newBookmark) {
    return knex
      .insert(newBookmark)
      .into('bookmarktable')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

  // READ
  getById(knex, id) {
    return knex.from('bookmarktable').select('*').where('id', id).first()
  },

  // DELETE
  deleteBookmark(knex, id) {
    return knex('bookmarktable')
      .where({ id })
      .delete()
  },

  // UPDATE
  updateBookmark(knex, id, newBookmarkFilds) {
    return knex('bookmarktable')
      .where({ id })
      .update(newBookmarkFilds)
  }
}

module.exports = BookmarkService;