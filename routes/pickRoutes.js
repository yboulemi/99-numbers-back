const express = require('express');
const router = express.Router();
const pickController = require('../controllers/pickController');

router.post('/', pickController.createPick);

router.get('/user/:userId', pickController.getUserPicks);

// Additional routes for managing picks can be added here

module.exports = router;
