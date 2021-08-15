const { authJwt } = require('../middlewares');

module.exports = (app) => {
  const posts = require('../controllers/post.controller.js');

  var router = require('express').Router();

  router.route('/').get([authJwt.verifyToken], posts.findAll).post([authJwt.verifyToken], posts.create);
  router.get('/:id', [authJwt.verifyToken], posts.findOne);

  router.route('/:_id/like').get([authJwt.verifyToken], posts.toggleLike);
  router.route('/:_id/comment').post([authJwt.verifyToken], posts.addComment);

  router.route('/:_id').delete([authJwt.verifyToken], posts.delete);

  app.use('/api/Post', router);
};
