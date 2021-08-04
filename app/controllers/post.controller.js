const db = require("../models");
const Post = db.posts;

// Create and Save a new article
exports.create = (req, res) => {
  // Validate request
  if (!req.body.content) {
    res.status(400).send({ message: "Posts can not be empty!" });
    return;
  }

  // Create a article
  const post = new Post({
    Content: req.body.content,
    Author: req.body.author_id,
  });

  // Save article in the database
  post
    .save(post)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error ss while creating the article."
      });
    });
};

// Retrieve all posts from the database.
exports.findAll = (req, res) => {
  const content = req.query.content;
  var condition = content ? { Content: { $regex: new RegExp(content), $options: "i" } } : {};

  Post.find(condition).populate('author').populate('likes').populate('comments')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving posts."
      });
    });
};

// // Find a single article with an id
// exports.findOne = (req, res) => {
//   const id = req.params.id;

//   Article.findById(id)
//     .then(data => {
//       if (!data)
//         res.status(404).send({ message: "Not found article with id " + id });
//       else res.send(data);
//     })
//     .catch(err => {
//       res
//         .status(500)
//         .send({ message: "Error retrieving article with id=" + id });
//     });
// };

// // Update a article by the id in the request
// exports.update = (req, res) => {
//   if (!req.body) {
//     return res.status(400).send({
//       message: "Data to update can not be empty!"
//     });
//   }

//   const id = req.params.id;

//   Article.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
//     .then(data => {
//       if (!data) {
//         res.status(404).send({
//           message: `Cannot update article with id=${id}. Maybe article was not found!`
//         });
//       } else res.send({ message: "article was updated successfully." });
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Error updating article with id=" + id
//       });
//     });
// };

// // Delete a article with the specified id in the request
// exports.delete = (req, res) => {
//   const id = req.params.id;

//   Article.findByIdAndRemove(id)
//     .then(data => {
//       if (!data) {
//         res.status(404).send({
//           message: `Cannot delete article with id=${id}. Maybe article was not found!`
//         });
//       } else {
//         res.send({
//           message: "article was deleted successfully!"
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Could not delete article with id=" + id
//       });
//     });
// };