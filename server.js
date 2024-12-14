const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');  // Import dotenv to load environment variables
const userRoutes = require('./routes/userRoutes');  // Import user routes
const app = express();

// Load environment variables from .env file
dotenv.config();

// Middleware setup
app.use(cors());
app.use(express.json());  // For parsing application/json

// Add user routes with '/api' prefix
app.use('/api', userRoutes);  // All user-related routes are now prefixed with /api

// MongoDB connection using .env variable for consistency
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port 3000');
});
