// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const projectController = require('./../controllers/projectController');
const authController = require('./../controllers/authController');
const { isMember, isOwner, isOwnerOrAdmin } = require('./../middleware/projectAuth');

// All routes require authentication
router.use(authController.protect);

// Project routes
router
  .route('/')
  .get(projectController.getAllProjects)
  .post(projectController.createProject);

router
  .route('/:id')
  .get(isMember, projectController.getProjectById)
  .patch(isOwnerOrAdmin, projectController.updateProject)
  .delete(isOwner, projectController.deleteProject);

// Member management routes
router
  .route('/:id/members')
  .get(isMember, projectController.getProjectMembers)
  .post(isOwnerOrAdmin, projectController.addMember);

router
  .route('/:id/members/:userId')
  .delete(isOwnerOrAdmin, projectController.removeMember);

module.exports = router;