module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.HEROKU_POSTGRESQL_ONYX_URL || 'postresql://dunder_mifflin:hi@localhost/bookmarks',
}