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
        Company: {type: Schema.Types.ObjectId, ref: 'Company'},
        RoleID: {type: Schema.Types.ObjectId, ref: 'Role'}
      },
      { timestamps: true }
    )
  );

  return User;
};