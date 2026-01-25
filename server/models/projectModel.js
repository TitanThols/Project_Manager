const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A project must have a name"],
    unique: true,
    trim: true,
    maxlength: [40, "A project must be less than or equal to 40 characters"],
    minlength: [10, "A project must be more than or equal to 10 characters"],
  },
  description: {
    type: String,
    required: [true, "A project must have a description"],
    minlength: [
      20,
      "A project description must be more than or equal to 10 characters",
    ],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
  },
  members: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
