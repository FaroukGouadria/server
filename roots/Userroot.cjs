const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController.cjs');
const {
  validateUserSignUp,
  userValidation,
} = require('../MiddleWares/Validation/ValidationUser.cjs');

router.post(
  '/register',
  validateUserSignUp,
  userValidation,
  UserController.register,
);

module.exports = router;
