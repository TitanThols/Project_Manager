// middleware/validation.js
const Joi = require('joi');

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({ 
        status: 'fail',
        errors 
      });
    }
    next();
  };
};

// User validation schemas
const userSchemas = {
  signup: Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must be less than 50 characters',
      'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(8).required().messages({
      'string.min': 'Password must be at least 8 characters long',
      'any.required': 'Password is required'
    }),
    passwordConfirm: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Password confirmation is required'
    })
  }),
  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email',
      'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    })
  }),
  updatePassword: Joi.object({
    passwordCurrent: Joi.string().required().messages({
      'any.required': 'Current password is required'
    }),
    password: Joi.string().min(8).required().messages({
      'string.min': 'New password must be at least 8 characters long',
      'any.required': 'New password is required'
    }),
    passwordConfirm: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Password confirmation is required'
    })
  })
};

// Project validation schemas
const projectSchemas = {
  create: Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
      'string.min': 'Project name must be at least 3 characters long',
      'string.max': 'Project name must be less than 100 characters',
      'any.required': 'Project name is required'
    }),
    description: Joi.string().max(500).optional().messages({
      'string.max': 'Description must be less than 500 characters'
    })
  }),
  update: Joi.object({
    name: Joi.string().min(3).max(100).optional().messages({
      'string.min': 'Project name must be at least 3 characters long',
      'string.max': 'Project name must be less than 100 characters'
    }),
    description: Joi.string().max(500).optional().messages({
      'string.max': 'Description must be less than 500 characters'
    })
  }),
  addMember: Joi.object({
    userId: Joi.string().length(24).hex().required().messages({
      'string.length': 'User ID must be a valid MongoDB ObjectId',
      'string.hex': 'User ID must be a valid MongoDB ObjectId',
      'any.required': 'User ID is required'
    }),
    role: Joi.string().valid('owner', 'admin', 'member').optional().messages({
      'any.only': 'Role must be one of: owner, admin, member'
    })
  })
};

// Task validation schemas
const taskSchemas = {
  create: Joi.object({
    title: Joi.string().min(3).max(200).required().messages({
      'string.min': 'Task title must be at least 3 characters long',
      'string.max': 'Task title must be less than 200 characters',
      'any.required': 'Task title is required'
    }),
    description: Joi.string().max(1000).optional().messages({
      'string.max': 'Description must be less than 1000 characters'
    }),
    status: Joi.string().valid('pending', 'in-progress', 'completed').optional().messages({
      'any.only': 'Status must be one of: pending, in-progress, completed'
    }),
    priority: Joi.string().valid('low', 'medium', 'high').optional().messages({
      'any.only': 'Priority must be one of: low, medium, high'
    }),
    projectId: Joi.string().length(24).hex().required().messages({
      'string.length': 'Project ID must be a valid MongoDB ObjectId',
      'string.hex': 'Project ID must be a valid MongoDB ObjectId',
      'any.required': 'Project ID is required'
    }),
    assignedTo: Joi.string().length(24).hex().optional().messages({
      'string.length': 'Assigned user ID must be a valid MongoDB ObjectId',
      'string.hex': 'Assigned user ID must be a valid MongoDB ObjectId'
    }),
    dueDate: Joi.date().min('now').optional().messages({
      'date.min': 'Due date must be in the future'
    })
  }),
  update: Joi.object({
    title: Joi.string().min(3).max(200).optional().messages({
      'string.min': 'Task title must be at least 3 characters long',
      'string.max': 'Task title must be less than 200 characters'
    }),
    description: Joi.string().max(1000).optional().messages({
      'string.max': 'Description must be less than 1000 characters'
    }),
    status: Joi.string().valid('pending', 'in-progress', 'completed').optional().messages({
      'any.only': 'Status must be one of: pending, in-progress, completed'
    }),
    priority: Joi.string().valid('low', 'medium', 'high').optional().messages({
      'any.only': 'Priority must be one of: low, medium, high'
    }),
    assignedTo: Joi.string().length(24).hex().optional().allow(null).messages({
      'string.length': 'Assigned user ID must be a valid MongoDB ObjectId',
      'string.hex': 'Assigned user ID must be a valid MongoDB ObjectId'
    }),
    dueDate: Joi.date().optional().allow(null).messages({
      'date.base': 'Due date must be a valid date'
    })
  })
};

module.exports = {
  validate,
  userSchemas,
  projectSchemas,
  taskSchemas
};