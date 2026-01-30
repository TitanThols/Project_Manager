// controllers/taskController.js
const Task = require('../models/taskModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// CREATE TASK
exports.createTask = catchAsync(async (req, res, next) => {
  if (!req.body.projectId) {
    return next(new AppError('Please provide projectId', 400));
  }
  
  const task = new Task({
    ...req.body,
    createdBy: req.user._id
  });
  await task.save();
  
  const populatedTask = await Task.findById(task._id)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('projectId', 'name');
  
  res.status(201).json({
    status: 'success',
    data: {
      task: populatedTask
    }
  });
});

// GET ALL TASKS (with search, filter, sort, pagination)
exports.getAllTasks = catchAsync(async (req, res, next) => {
  const { projectId, status, priority, assignedTo, search, sort, page = 1, limit = 10 } = req.query;
  
  if (!projectId) {
    return next(new AppError('Please provide projectId query parameter', 400));
  }
  
  // Build filter query
  const filter = { projectId };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assignedTo) filter.assignedTo = assignedTo;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  // Sort options
  let sortOption = {};
  if (sort) {
    const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
    const sortOrder = sort.startsWith('-') ? -1 : 1;
    sortOption[sortField] = sortOrder;
  } else {
    sortOption = { createdAt: -1 }; // Default: newest first
  }
  
  // Pagination
  const skip = (page - 1) * limit;
  
  const tasks = await Task.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(parseInt(limit))
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('projectId', 'name');
  
  const total = await Task.countDocuments(filter);
  
  res.status(200).json({
    status: 'success',
    results: tasks.length,
    data: {
      tasks
    },
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalTasks: total,
      limit: parseInt(limit)
    }
  });
});

// GET TASK BY ID
exports.getTaskById = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('projectId', 'name');
  
  if (!task) {
    return next(new AppError('No task found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      task
    }
  });
});

// UPDATE TASK
exports.updateTask = catchAsync(async (req, res, next) => {
  // Don't allow updating projectId or createdBy
  if (req.body.projectId || req.body.createdBy) {
    return next(new AppError('You cannot update projectId or createdBy', 400));
  }
  
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  )
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('projectId', 'name');
  
  if (!task) {
    return next(new AppError('No task found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      task
    }
  });
});

// DELETE TASK
exports.deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  
  if (!task) {
    return next(new AppError('No task found with that ID', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});