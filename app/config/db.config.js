const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  url: `${process.env.DB_PROVIDER}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
};