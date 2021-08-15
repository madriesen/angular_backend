const config = require('../config/auth.config');
const db = require('../models');
const User = db.users;
const Role = db.roles;

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

// Create and Save a new user
exports.create = (req, res) => {
  // Validate request
  if (!req.body.Email) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }

  Role.findOne({ Name: 'Gebruiker' }).then((role) => {
    const user = new User({
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      Email: req.body.Email,
      Username: req.body.Username ? req.body.Username : req.body.Email,
      Password: bcrypt.hashSync(req.body.Password),
      RoleID: role._id,
    });

    // Save user in the database
    user
      .save(user)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'Some error occurred while creating the user.',
        });
      });
  });

  // Create a user
};

// Find a single user with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .populate('RoleID')
    .populate('Company')
    .then((data) => {
      console.log('data', data);
      if (!data) res.status(404).send({ message: 'Not found user with id ' + id });
      else res.send(data);
    })
    .catch(() => {
      res.status(500).send({ message: 'Error retrieving user with id=' + id });
    });
};

exports.findOneByEmail = (req, res) => {
  const email = req.params.email;

  User.findOne({ Email: email, Company: null }).then((user) => {
    if (!user) res.status(404).send({ message: 'Not found user with email ' + email });
    else res.send(user);
  });
};

exports.authenticate = (req, res) => {
  User.findOne({
    Username: req.body.Username,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: 'User Not found.' });
    }

    var passwordIsValid = bcrypt.compareSync(req.body.Password, user.Password);

    if (req.body.Password == user.Password) {
      passwordIsValid = true;
    }

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: 'Invalid Password!',
      });
    }
    var token = jwt.sign({ id: user.id, CompanyId: user.Company ? user.Company : '' }, config.secret, {
      expiresIn: 86400, // 24 hours
    });
    res.status(200).send({
      _id: user._id,
      AccessToken: token,
      CompanyId: user.Company ? user.Company : '',
    });
  });
};

// Delete a user with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete user with id=${id}. Maybe user was not found!`,
        });
      } else {
        res.send({
          message: 'user was deleted successfully!',
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete user with id=' + id,
      });
    });
};
// Update a article by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Data to update can not be empty!',
    });
  }

  const id = req.params.id;

  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((user) => {
      if (!user) {
        res.status(404).send({
          message: `Cannot update user with id=${id}. Maybe user was not found!`,
        });
      } else res.send(user);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating user with id=' + id,
      });
    });
};
