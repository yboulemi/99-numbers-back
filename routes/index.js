const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const roundRoutes = require('./roundRoutes');
const pickRoutes = require('./pickRoutes');
const adminRoutes = require('./adminRoutes');

router.use('/user', userRoutes);
router.use('/round', roundRoutes); 
router.use('/pick', pickRoutes); 
router.use('/admin', adminRoutes);

module.exports = router;
