const { authJwt } = require('../middlewares');

module.exports = (app) => {
  const company = require('../controllers/company.controller.js');

  var router = require('express').Router();

  // Retrieve all articlestatus
  router.route('/').get([authJwt.verifyToken], company.findAll);

  router.route('/').post([authJwt.verifyToken], company.create);

  router
    .route('/:id')
    .get([authJwt.verifyToken], company.findOne)
    .post([authJwt.verifyToken], company.addUserToCompany);

  app.use('/api/Company', router);
};
