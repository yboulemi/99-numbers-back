require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const https = require('https');
const fs = require('fs');
const sequelize = require('./db/database');

// Import models
const User = require('./db/models/User');
const Round = require('./db/models/Round');
const Pick = require('./db/models/Pick');

// Import scheduled tasks
const { setupScheduledTasks } = require('./tasks/taskScheduler');

// Import routes
const routes = require('./routes');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// CORS options
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 'https://99-numbers.com' : 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: 'Content-Type,Authorization'
};

app.use(cors(corsOptions));
app.use('/api', routes);

// Setup scheduled tasks
setupScheduledTasks();

// Synchronize all models with the database
sequelize.sync({ alter: true }).then(() => {
  console.log('Database synchronized.');

  if (process.env.NODE_ENV === 'production') {
    // In production, use HTTPS
    const sslOptions = {
      key: fs.readFileSync('/etc/ssl/private/99-numbers.com.key.pem'), 
      cert: fs.readFileSync('/etc/ssl/certs/99-numbers.com.pem') 
    };
    https.createServer(sslOptions, app).listen(8443, () => {
      console.log('Server running on https://99-numbers-com:8443');
    });
  } else {
    // In development, use HTTP
    const port = process.env.PORT || 3252;
    http.createServer(app).listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  }

}).catch((error) => {
  console.error('Failed to synchronize database:', error);
});
