const { authJwt } = require('../middlewares');

module.exports = (app) => {
  const posts = require('../controllers/post.controller.js');

  var router = require('express').Router();

  router.route('/').get([authJwt.verifyToken], posts.findAll).post([authJwt.verifyToken], posts.create);

  router.route('/:_id/like').get([authJwt.verifyToken], posts.toggleLike);

  app.use('/api/Post', router);
};
