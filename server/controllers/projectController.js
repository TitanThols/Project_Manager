const Project = require('../models/projectModel');
const ProjectMember = require('../models/projectMemberModel');
const Task = require('../models/taskModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createProject = catchAsync(async (req, res, next) => {
  const project = new Project({
    ...req.body,
    createdBy: req.user._id
  });
  await project.save();
  
  await ProjectMember.create({
    projectId: project._id,
    userId: req.user._id,
    role: 'owner'
  });
  
  res.status(201).json({
    status: 'success',
    data: {
      project
    }
  });
});

exports.getAllProjects = catchAsync(async (req, res, next) => {
  const memberships = await ProjectMember.find({ userId: req.user._id });
  const projectIds = memberships.map(m => m.projectId);
  
  const projects = await Project.find({ _id: { $in: projectIds } })
    .populate('createdBy', 'name email');
  
  res.status(200).json({
    status: 'success',
    results: projects.length,
    data: {
      projects
    }
  });
});

exports.getProjectById = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id)
    .populate('createdBy', 'name email');
  
  if (!project) {
    return next(new AppError('No project found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      project
    }
  });
});

exports.updateProject = catchAsync(async (req, res, next) => {
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  ).populate('createdBy', 'name email');
  
  if (!project) {
    return next(new AppError('No project found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      project
    }
  });
});

exports.deleteProject = catchAsync(async (req, res, next) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  
  if (!project) {
    return next(new AppError('No project found with that ID', 404));
  }
  
  await ProjectMember.deleteMany({ projectId: req.params.id });
  
  await Task.deleteMany({ projectId: req.params.id });
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.addMember = catchAsync(async (req, res, next) => {
  const { userId, role } = req.body;
  
  if (!userId) {
    return next(new AppError('Please provide userId', 400));
  }
  
  const member = await ProjectMember.create({
    projectId: req.params.id,
    userId,
    role: role || 'member'
  });
  
  const populatedMember = await ProjectMember.findById(member._id)
    .populate('userId', 'name email');
  
  res.status(201).json({
    status: 'success',
    data: {
      member: populatedMember
    }
  });
});

exports.removeMember = catchAsync(async (req, res, next) => {
  const member = await ProjectMember.findOneAndDelete({
    projectId: req.params.id,
    userId: req.params.userId
  });
  
  if (!member) {
    return next(new AppError('Member not found in this project', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getProjectMembers = catchAsync(async (req, res, next) => {
  const members = await ProjectMember.find({ projectId: req.params.id })
    .populate('userId', 'name email');
  
  res.status(200).json({
    status: 'success',
    results: members.length,
    data: {
      members
    }
  });
});