const { Schema } = require("mongoose");

module.exports = mongoose => {
  const Company = mongoose.model(
    "Company",
    mongoose.Schema(
      {
        Name: String,
        Address: String,
        Description: String,
      },
      { timestamps: true }
    )
  );

  return Company;
};