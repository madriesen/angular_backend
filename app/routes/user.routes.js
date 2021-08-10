module.exports = app => {
  const users = require("../controllers/user.controller.js");
  const { authJwt } = require("../middlewares");

  var router = require("express").Router();

  // Create a new user
  router.post("/", users.create);
  
  // Authenticate user
  router.post("/authenticate", users.authenticate);

  // Retrieve a single user with id
  router.route("/:id").get([authJwt.verifyToken], users.findOne).put([authJwt.verifyToken], users.update).delete([authJwt.verifyToken], users.delete);


  app.use('/api/User', router);
  
};