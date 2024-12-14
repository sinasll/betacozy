const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB URI from .env file
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/cozybetabot';

// Connect to MongoDB without deprecated options
mongoose.connect(mongoURI)
.then(() => {
  console.log('Successfully connected to MongoDB');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1); // Exit if connection fails
});

// Export the mongoose instance for use in other files
module.exports = mongoose;
