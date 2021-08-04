const { authJwt } = require('../middlewares');

module.exports = (app) => {
  const posts = require('../controllers/post.controller.js');

  var router = require('express').Router();

  // Create a new article
  router.post('/', posts.create);

  // Retrieve all articles
  router.route('/').get([authJwt.verifyToken], posts.findAll);

  router.route('/:_id/like').get([authJwt.verifyToken], posts.toggleLike);

  app.use('/api/Post', router);
};
