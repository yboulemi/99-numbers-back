const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route for user registration
router.post('/register', userController.registerUser);

// Route for deleting a user account
// router.delete('/delete/:userId', userController.deleteUser);

// Route for modifying a user's password
router.patch('/modify-password', userController.modifyPassword);

// Route for user login
router.post('/login', userController.loginUser);

// Route for checking if a user has played today
router.get('/:userId/has-played-today', userController.getHasPlayedToday);

module.exports = router;
