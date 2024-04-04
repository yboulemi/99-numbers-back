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

// CORS configuration for development
app.use(cors({
  origin: 'http://localhost:3000'
}));

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
