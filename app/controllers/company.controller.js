const { roles } = require('../models');
const db = require('../models');
const Role = db.roles;
const User = db.users;
const Company = db.companies;

// Retrieve all companies from the database.
exports.findAll = (req, res) => {
  const name = req.query.Name;
  var condition = name ? { name: { $regex: new RegExp(name), $options: 'i' } } : {};

  Company.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Something went wrong while retrieving companies.',
      });
    });
};

// Find a single company with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Company.findById(id)
    .then((data) => {
      if (!data) res.status(404).send({ message: 'Not found company with id ' + id });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: 'Error retrieving company with id=' + id });
    });
};
// Create and Save a new Company
exports.create = (req, res) => {
  // Validate request
  if (!req.body.Name) {
    res.status(400).send({ message: 'Company needs a name' });
    return;
  }

  // Create a company
  const company = new Company({
    Name: req.body.Name,
    Description: req.body.Description,
    Address: req.body.Address,
  });

  // Save company and user in the database
  company
    .save(company)
    .then(async (data) => {
      User.findById(req.UserId).then((user) => {
        Role.find({ Name: 'Superadmin' }).then((role) => {
          user.RoleID = role[0]._id;
          user.Company = company.id;
          user.save();
        });
      });
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Something went wrong while creating the company.',
      });
    });
};
