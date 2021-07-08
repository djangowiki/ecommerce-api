const express = require('express');
const dotenv = require('dotenv');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const hpp = require('hpp');
const xss = require('xss-clean');
const morgan = require('morgan');

// Init app.
const app = express();

// Load env vars.
dotenv.config({ path: './config/env.env' });

// Custom Modules.
const connectDB = require('./config/db');
const limiter = require('./middlewares/limitRequests');
const errorHandler = require('./middlewares/error');

// Routes.
const auth = require('./routes/auth');
const admin = require('./routes/admin');
const products = require('./routes/products');

// Database Connection.
connectDB();

// Middlewares.
app.use(express.json());
app.use(mongoSanitize());
app.use(helmet());
app.use(hpp());
app.use(xss());
if ((process.env.NODE_ENV = 'development')) {
  app.use(morgan('dev'));
}

// Custom Middlewares
// Routes.
app.use('/api/v1/auth', auth);
app.use('/api/v1/admin', admin);
app.use('/api/v1/products', products);
app.use(limiter);
app.use(errorHandler);

// Create server.
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server Running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
