const express = require('express');
const router = express.Router();
const { authenticateToken, adminOnly } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');


// Route to get all users
router.get('/users', authenticateToken, adminOnly, userController.getAllUsers);

// Route to update a user's role
router.patch('/user/:userId/role', authenticateToken, adminOnly, userController.updateUserRole);

module.exports = router;
