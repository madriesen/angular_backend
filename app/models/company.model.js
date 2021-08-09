const { Schema } = require("mongoose");

module.exports = mongoose => {
  const Company = mongoose.model(
    "Company",
    mongoose.Schema(
      {
        Name: String,
        Address: String,
        Description: String,
        Owner:{type: Schema.Types.ObjectId, ref: 'User'},
        Colleagues: [{type: Schema.Types.ObjectId, ref:'User'}],
      },
      { timestamps: true }
    )
  );

  return Company;
};