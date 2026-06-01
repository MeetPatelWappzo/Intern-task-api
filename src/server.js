require('dotenv').config();          // must be first so env vars are available
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5001;

// Connect to Database and start listening
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    const baseUrl = process.env.APP_URL || `http://localhost:${PORT}`;
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger docs → ${baseUrl}/api/docs`);
  });
};

startServer();
