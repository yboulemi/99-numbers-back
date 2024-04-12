const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const pickController = require('../controllers/pickController');

router.post('/', authenticateToken, pickController.createPick);

router.get('/user/:userId', authenticateToken, pickController.getUserPicks);

router.get('/user/:userId/latest-round', authenticateToken, pickController.getPicksFromLatestRoundForUser);

// Additional routes for managing picks can be added here

module.exports = router;
