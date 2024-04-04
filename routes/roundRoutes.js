const express = require('express');
const router = express.Router();
const roundController = require('../controllers/roundController');

// Route to create a new round
router.post('/', roundController.createRound);

// Route to close a round
router.patch('/:roundId/close', roundController.closeRound);

module.exports = router;
