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
    .populate('Users')
    .then((data) => {
      if (!data) res.status(404).send({ message: 'Not found company with id ' + id });
      else res.status(200).send(data);
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
    .then((data) => {
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

exports.update = (req, res) => {
  const { Name, Address } = req.body;
  const Description = req.body.Description || '';

  if (!Name || !Address) return res.status(401).send('A company needs a name and an address!');

  Company.findById(req.params.id).then((company) => {
    if (!company) return res.status(404).send('No company found with id: ' + req.params.id);

    company.Name = Name;
    company.Address = Address;
    company.Description = Description;

    company.save().then((company) => {
      return res.send(company);
    });
  });
};

exports.addUserToCompany = (req, res) => {
  const userId = req.body.UserId;
  // Validate request
  if (!userId) {
    res.status(400).send({ message: "Without userId I can't add a user to the company!" });
    return;
  }

  User.findById(userId)
    .then((user) => {
      if (!user) res.status(404).send({ message: 'Not found user with id ' + userId });
      user.Company = req.params.id;
      user.save().then((user) => {
        Company.findById(user.Company)
          .populate('Users')
          .then((company) => {
            res.send(company);
          });
      });
    })
    .catch(() => {
      res.status(500).send({ message: 'Error retrieving user with id=' + userId });
    });
};
