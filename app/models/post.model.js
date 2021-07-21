module.exports = mongoose => {
  const Post = mongoose.model(
    "Post",
    mongoose.Schema(
      {
		Content: String,
		UserID: String,
      },
      { timestamps: true }
    )
  );

  return Post;
};