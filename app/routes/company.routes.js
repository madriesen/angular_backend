const { authJwt } = require('../middlewares');

module.exports = app => {
  const company = require("../controllers/company.controller.js");

  var router = require("express").Router();

  // Retrieve all articlestatus
  router.route('/').get([authJwt.verifyToken], company.findAll);

  // Retrieve a single articlestatus with id
  router.get("/:id", company.findOne);

  router.route('/:userId').post([authJwt.verifyToken], company.create);

  app.use('/api/Company', router);
};