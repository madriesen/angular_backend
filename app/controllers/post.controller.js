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
  if (!req.UserId) {
    res.status(400).send({ message: 'Posts must have an author!' });
    return;
  }

  const newPostVariables = {
    Content: req.body.Content,
    Author: req.UserId,
  };

  if (req.CompanyId) newPostVariables.Company = req.CompanyId;

  // Create a article
  const post = new Post(newPostVariables);

  // Save article in the database
  post.save((error, post) => {
    if (error) throw new Error('Post kon niet geplaatst worden!');
    post
      .populate('Author')
      .populate('Likes')
      .populate('Company')
      .populate({ path: 'Comments', populate: { path: 'Author' } }, () => {
        global.io.emit('post_create', post._id);
        res.send(post);
      });
  });
};

// Retrieve all posts from the database of your company
exports.findAll = (req, res) => {
  const condition = req.CompanyId ? { Company: req.CompanyId } : { Company: null };

  Post.find(condition)
    .populate('Author')
    .populate('Likes')
    .populate('Company')
    .populate({ path: 'Comments', populate: { path: 'Author' } })
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
        .populate('Company')
        .populate({ path: 'Comments', populate: { path: 'Author' } }, () => {
          global.io.emit('like_toggle', post._id);
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
            global.io.emit('comment_create', post._id);
            res.status(201).send(post);
          });
      });
    });
  });
};

// Find a single article with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Post.findOne({ _id: id })
    .populate('Author')
    .populate('Likes')
    .populate('Company')
    .populate({ path: 'Comments', populate: { path: 'Author' } })
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
