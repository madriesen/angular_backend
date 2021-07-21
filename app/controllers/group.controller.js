const db = require("../models");
const Group = db.groups;


// Retrieve all companies from the database.
exports.findAll = (req, res) => {
  const name = req.query.Name;
  var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};

  Group.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving groups."
      });
    });
};

// Find a single groups with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Group.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found group with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving group with id=" + id });
    });
};