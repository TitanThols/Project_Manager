const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authController = require("../controllers/authController");
const { isMember, isTaskCreator } = require("../middleware/projectAuth");
const { validate, taskSchemas } = require('../middleware/validation');

// All routes require authentication
router.use(authController.protect);

router
  .route("/")
  .post(isMember, validate(taskSchemas.create), taskController.createTask)
  .get(taskController.getAllTasks);

router
  .route("/:id")
  .get(taskController.getTaskById)
  .patch(validate(taskSchemas.update), taskController.updateTask)
  .delete(isTaskCreator, taskController.deleteTask);

module.exports = router;