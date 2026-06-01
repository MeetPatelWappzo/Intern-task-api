const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');
const verifyToken = require('./middleware/auth.middleware');

// Load environment variables
dotenv.config();

const app = express();

// Body Parser Middleware
app.use(express.json());

// Mount Authentication Routes
app.use('/api/auth', authRoutes);

// Protected Mock Route for API verification
app.get('/api/tasks', verifyToken, (req, res) => {
  return res.status(200).json({
    message: 'Secure resource accessed successfully',
    user: req.user,
    tasks: [
      { id: 1, title: 'Learn Express.js', completed: true },
      { id: 2, title: 'Learn Mongoose & MongoDB', completed: false }
    ]
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

module.exports = app;
