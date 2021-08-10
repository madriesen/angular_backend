const db = require('../models');
const Post = db.posts;
const Comment = db.comments;

// Create and Save a new article
exports.create = (req, res) => {
  // Validate request
  if (!req.body.Content) {
    res.status(400).send({ message: 'Posts can not be empty!' });
    return;
  }
  if (!req.body.UserId) {
    res.status(400).send({ message: 'Posts must have an author!' });
    return;
  }

  // Create a article
  const post = new Post({
    Content: req.body.Content,
    Author: req.body.UserId,
    Company: req.CompanyId,
  });

  // Save article in the database
  post
    .save(post)
    .then(async (data) => {

      const populatedPost = await data
        .populate('Author')
        .populate('Likes')
        .populate('Company')
        .populate({ path: 'Comments', populate: { path: 'Author' } })

      res.send(populatedPost);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error ss while creating the article.',
      });
    });
};

// Retrieve all posts from the database of your company
exports.findAll = (req, res) => {
  const content = req.query.Content;
  //var condition = content ? { Content: { $regex: new RegExp(content), $options: 'i' } } : {};

  Post.find({Company: req.CompanyId})
  .populate('Author')
  .populate('Likes')
  .populate('Company')
    .sort({ createdAt: -1 })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving posts.',
      });
    });
};

exports.toggleLike = (req, res) => {
  const { _id } = req.params;

  Post.findOne({ _id }).then((post) => {
    const index = post.Likes != null ? post.Likes.findIndex((user) => user._id == req.UserId) : 0;
    if (index > -1) post.Likes.splice(index, 1);
    else post.Likes.push(req.UserId);
    post.save().then((post) => {
      post
        .populate('Likes')
        .populate('Author')
        .populate({ path: 'Comments', populate: { path: 'Author' } }, () => {
          res.status(201).send(post);
        });
    });
  });
};

exports.addComment = (req, res) => {
  const { _id } = req.params;
  const { Content } = req.body;

  const comment = new Comment({
    Content: Content,
    Author: req.UserId,
    Likes: [],
  });

  comment.save((error, comment) => {
    if (error) throw new Error('Comment kon niet geplaatst worden!');

    Post.findOne({ _id }).then((post) => {
      post.Comments.push(comment._id);

      post.save((error) => {
        if (error) throw new Error('Comment kon niet worden geplaatst!');
        post
          .populate('Likes')
          .populate('Author')
          .populate({ path: 'Comments', populate: { path: 'Author' } }, () => {
            res.status(201).send(post);
          });
      });
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

// Delete a post with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params._id;

  Post.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete post with id=${id}. Maybe post was not found!`,
        });
      } else {
        res.send({
          message: 'post was deleted successfully!',
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete post with id=' + id,
      });
    });
};
