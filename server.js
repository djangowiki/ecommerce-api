const express = require('express');
const dotenv = require('dotenv');

// Init app.
const app = express();

// Load env vars.
dotenv.config({ path: './config/env.env' });

// Custom Modules.
const connectDB = require('./config/db');

// Database Connection.
connectDB();

// Create server.
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server Running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
