module.exports = mongoose => {
  const Company = mongoose.model(
    "Company",
    mongoose.Schema(
      {
        Name: String
      },
      { timestamps: true }
    )
  );

  return Company;
};