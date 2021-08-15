module.exports = (mongoose) => {
  const CompanySchema = mongoose.Schema(
    {
      Name: String,
      Address: String,
      Description: String,
    },
    { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
  );

  CompanySchema.virtual('Users', {
    ref: 'User',
    localField: '_id',
    foreignField: 'Company',
  });

  const Company = mongoose.model('Company', CompanySchema);
  return Company;
};
