const Project = require("./../models/projectModel");
const APIFeatures = require("./../utils/apiFeatures");

exports.getAllProjects = async (req, res) => {
  try {
    const features = new APIFeatures(Project.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const projects = await features.query;
    res.status(200).json({
      status: "success",
      results: projects.length,
      data: {
        projects,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.createProject = async (req, res) => {
  try {
    const newProject = await Project.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        project: newProject,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        status: "fail",
        message: "No project found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        project,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({
        status: "fail",
        message: "No project found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        project,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        status: "fail",
        message: "No project found with that ID",
      });
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
