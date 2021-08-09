const { authJwt } = require('../middlewares');

module.exports = app => {
  const company = require("../controllers/company.controller.js");

  var router = require("express").Router();

  // Retrieve all articlestatus
  router.route('/').get([authJwt.verifyToken], company.findAll).post([authJwt.verifyToken], company.create);

  // Retrieve a single articlestatus with id
  router.get("/:id", company.findOne);

  app.use('/api/Company', router);
};