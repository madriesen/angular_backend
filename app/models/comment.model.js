const { Schema } = require("mongoose");

module.exports = mongoose => {

  const CommentSchema = new Schema({
    content: String,
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    likes: [{type: Schema.Types.ObjectId, ref: 'User'}],
  }, {timestamps: true})


  const Comment = mongoose.model(
    "Comment",
   CommentSchema
  );

  return Comment;
};