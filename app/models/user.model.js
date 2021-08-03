const { Schema } = require("mongoose");

module.exports = mongoose => {
  const User = mongoose.model(
    "User",
    mongoose.Schema(
      {
        FirstName: String,
        LastName: String,
        Email: String,
        Username: String,
        Password: String,
        RoleID: {type: Schema.Types.ObjectId, ref: 'Role'}
      },
      { timestamps: true }
    )
  );

  return User;
};