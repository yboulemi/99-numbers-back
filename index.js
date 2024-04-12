require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sequelize = require('./db/database');

// Import models
const User = require('./db/models/User');
const Round = require('./db/models/Round');
const Pick = require('./db/models/Pick');

// Import scheduled tasks
const { setupScheduledTasks } = require('./tasks/taskScheduler'); // Adjust path as necessary

// Import routes
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3252;

// Middleware to parse JSON bodies
app.use(express.json());


const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 'https://99-numbers.com' : 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // enabling cookies and auth headers
  allowedHeaders: 'Content-Type,Authorization'
};

app.use('/api', routes);

// Setup scheduled tasks
setupScheduledTasks();

// Synchronize all models with the database, then start the server
sequelize.sync({ alter: true }).then(() => {
  console.log('Database synchronized.');
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}).catch((error) => {
  console.error('Failed to synchronize database:', error);
});
