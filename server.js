const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection (if needed)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API route for leaderboard or user score
app.put('/api/user/:userId/score', async (req, res) => {
  // Your existing logic for updating score
});

// Handle root route and serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Export the app for Vercel
module.exports = app;
