const { Schema } = require('mongoose');

module.exports = (mongoose) => {
  const PostSchema = new Schema(
    {
      Content: String,
      Author: { type: Schema.Types.ObjectId, ref: 'User' },
      Likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      Comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    },
    { timestamps: true }
  );

  const Post = mongoose.model('Post', PostSchema);

  return Post;
};
