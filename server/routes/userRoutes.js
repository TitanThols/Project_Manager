const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { validate, userSchemas } = require('../middleware/validation');

router.post('/signup', validate(userSchemas.signup), authController.signup);
router.post('/login', validate(userSchemas.login), authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.patch('/updatePassword', validate(userSchemas.updatePassword), authController.updatePassword);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;