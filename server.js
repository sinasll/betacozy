const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Enable CORS
app.use(cors());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API route for updating user score
app.put('/api/user/:userId/score', async (req, res) => {
  // Your existing logic for updating score
  res.status(200).json({ message: 'Score updated' });  // Example response
});

// Handle root route and serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Export the app for Vercel (it’s needed for Vercel’s serverless environment)
module.exports = app;
