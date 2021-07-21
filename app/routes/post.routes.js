module.exports = app => {
  const posts = require("../controllers/post.controller.js");

  var router = require("express").Router();

  // Create a new article
  router.post("/", posts.create);

  // Retrieve all articles
  router.get("/", posts.findAll);

  app.use('/api/Post', router);
};