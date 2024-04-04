// config/dbConfig.js
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: process.env.DATABASE_PASSWORD,
    database: 'numbersdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
  
  module.exports = dbConfig;
  