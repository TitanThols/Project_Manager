const express = require('express');
const router = express.Router();
const projectController = require('./../controllers/projectController');
const authController = require('./../controllers/authController');
const { isMember, isOwner, isOwnerOrAdmin } = require('./../middleware/projectAuth');
const { validate, projectSchemas } = require('./../middleware/validation'); // ADD THIS

// All routes require authentication
router.use(authController.protect);

// Project routes with validation
router
  .route('/')
  .get(projectController.getAllProjects)
  .post(validate(projectSchemas.create), projectController.createProject);

router
  .route('/:id')
  .get(isMember, projectController.getProject)
  .patch(isOwnerOrAdmin, validate(projectSchemas.update), projectController.updateProject)
  .delete(isOwner, projectController.deleteProject);

// Member management routes with validation
router
  .route('/:id/members')
  .get(isMember, projectController.getProjectMembers)
  .post(isOwnerOrAdmin, validate(projectSchemas.addMember), projectController.addMember);

router
  .route('/:id/members/:userId')
  .delete(isOwnerOrAdmin, projectController.removeMember);

module.exports = router;