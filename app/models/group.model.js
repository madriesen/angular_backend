module.exports = mongoose => {
    const Group = mongoose.model(
      "Group",
      mongoose.Schema(
        {
          Name: String
        },
        { timestamps: true }
      )
    );
  
    return Group;
  };