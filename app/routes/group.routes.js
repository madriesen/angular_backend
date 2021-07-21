module.exports = app => {
  const groups = require("../controllers/group.controller.js");

  var router = require("express").Router();

  // Retrieve all articlestatus
  router.get("/", groups.findAll);

  // Retrieve a single articlestatus with id
  router.get("/:id", groups.findOne);

  app.use('/api/Group', router);
};