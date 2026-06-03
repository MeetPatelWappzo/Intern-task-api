const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const taskRoutes = require('./routes/task.routes');
const fileRoutes = require('./routes/file.routes');

// Load environment variables
dotenv.config();

const app = express();


process.on('uncaughtException', (err) => {
  console.log("CRITICAL UNCAUGHT EXCEPTION: ", err.message);
  console.log(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('CRITICAL UNHANDLED REJECTION AT:', promise, 'REASON:', reason);
  process.exit(1);
});

// CORS Middleware Configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser Middleware
app.use(express.json());

// ── Swagger UI ──────────────────────────────────────────────
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Intern Task API Docs',
  swaggerOptions: {
    persistAuthorization: true  // keeps the Bearer token across page reloads
  }
}));

// Expose the raw OpenAPI JSON spec (useful for Postman import)
app.get('/api/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ── Serve Frontend ──────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../public')));

// ── API Routes ──────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/files', fileRoutes);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

module.exports = app;
