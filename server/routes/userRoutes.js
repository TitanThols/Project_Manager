const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { validate, userSchemas } = require('../middleware/validation'); // ADD THIS

// Public routes with validation
router.post('/signup', validate(userSchemas.signup), authController.signup);
router.post('/login', validate(userSchemas.login), authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

// Protected routes
router.patch('/updatePassword', validate(userSchemas.updatePassword), authController.updatePassword);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;