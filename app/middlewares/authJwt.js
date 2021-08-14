const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');
const db = require('../models');

verifyToken = (req, res, next) => {
  let token = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }
    req.UserId = decoded.id;
    req.CompanyId = decoded.CompanyId;
    next();
  });
};

const authJwt = {
  verifyToken,
};
module.exports = authJwt;
