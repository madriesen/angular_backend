const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  url: process.env.HEROKU_CONNECTION_STRING? process.env.HEROKU_CONNECTION_STRING : `${process.env.DB_PROVIDER}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
};