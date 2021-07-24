const { verifyToken } = require("../middlewares/authJwt");

module.exports = app => {
  const posts = require("../controllers/post.controller.js");

  var router = require("express").Router();
  const authorize = require("../middlewares/authJwt")
  // Create a new article
  router.post("/", posts.create);

  // Retrieve all articles
  router.route("/").get(verifyToken, posts.findAll);

  app.use('/api/Post', router);
};