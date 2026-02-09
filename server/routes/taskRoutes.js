const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authController = require("../controllers/authController");
const { isMember } = require("../middleware/projectAuth");
const { validate, taskSchemas } = require('../middleware/validation'); // ADD THIS

// All routes require authentication
router.use(authController.protect);

// Task routes with validation
router
  .route("/")
  .post(isMember, validate(taskSchemas.create), taskController.createTask)
  .get(taskController.getAllTasks);

router
  .route("/:id")
  .get(taskController.getTaskById)
  .patch(validate(taskSchemas.update), taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;