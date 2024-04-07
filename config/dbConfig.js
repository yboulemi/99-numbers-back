let dbConfig;

if (process.env.NODE_ENV === "production") {
  // Production database configuration
  dbConfig = {
    host: process.env.PROD_DB_HOST,
    user: process.env.PROD_DB_USER,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
} else {
  // Local (development) database configuration
  dbConfig = {
    host: "localhost",
    user: "root",
    password: process.env.DEV_DB_PASSWORD, // You can also use a local password or keep it empty for local development
    database: "numbersdb",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
}

module.exports = dbConfig;
