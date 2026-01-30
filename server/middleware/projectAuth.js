const catchAsync = require('../utils/catchAsync');
const ProjectMember = require('../models/projectMemberModel');
const AppError = require('../utils/appError');

exports.isMember = catchAsync(async (req, res, next) => {
  const projectId = req.params.id || req.params.projectId || req.body.projectId;

  if (!projectId) {
    return next(new AppError('Project ID not provided', 400));
  }

  const member = await ProjectMember.findOne({
    projectId,
    userId: req.user._id
  });

  if (!member) {
    return next(new AppError('Access denied. Not a project member.', 403));
  }

  req.projectMember = member;
  next();
});

exports.isOwner = catchAsync(async (req, res, next) => {
  const projectId = req.params.id || req.params.projectId;

  if (!projectId) {
    return next(new AppError('Project ID not provided', 400));
  }

  const member = await ProjectMember.findOne({
    projectId,
    userId: req.user._id,
    role: 'owner'
  });

  if (!member) {
    return next(new AppError('Access denied. Owner role required.', 403));
  }

  req.projectMember = member;
  next();
});

exports.isOwnerOrAdmin = catchAsync(async (req, res, next) => {
  const projectId = req.params.id || req.params.projectId;

  if (!projectId) {
    return next(new AppError('Project ID not provided', 400));
  }

  const member = await ProjectMember.findOne({
    projectId,
    userId: req.user._id,
    role: { $in: ['owner', 'admin'] }
  });

  if (!member) {
    return next(new AppError('Access denied. Admin or Owner role required.', 403));
  }

  req.projectMember = member;
  next();
});
