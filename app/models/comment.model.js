const { Schema } = require('mongoose');

module.exports = (mongoose) => {
  const CommentSchema = new Schema(
    {
      Content: String,
      Author: { type: Schema.Types.ObjectId, ref: 'User' },
      Likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true }
  );

  const Comment = mongoose.model('Comment', CommentSchema);

  return Comment;
};
