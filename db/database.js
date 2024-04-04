const { Sequelize } = require('sequelize');
const dbConfig = require('../config/dbConfig');

// Create a Sequelize instance with your database configuration
const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    dialect: 'mysql',
    pool: {
        max: dbConfig.connectionLimit,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = sequelize;
