module.exports = app => {
  const company = require("../controllers/company.controller.js");

  var router = require("express").Router();

  // Retrieve all articlestatus
  router.get("/", company.findAll);

  // Retrieve a single articlestatus with id
  router.get("/:id", company.findOne);

  app.use('/api/Company', router);
};