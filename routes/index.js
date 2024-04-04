const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const roundRoutes = require('./roundRoutes');
const pickRoutes = require('./pickRoutes');


router.use('/user', userRoutes);
router.use('/round', roundRoutes); 
router.use('/pick', pickRoutes); 

module.exports = router;
