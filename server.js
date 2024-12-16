const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const User = require('./models/User'); // Make sure the path to your User model is correct

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// API routes
app.get('/', (req, res) => {
  res.send('API is running!'); // Simple base endpoint for testing
});

// Update score for a user
app.put('/api/user/:userId/score', async (req, res) => {
  const { userId } = req.params;
  const { score } = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, { score }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Score updated successfully', user });
  } catch (error) {
    console.error('Error updating score:', error);
    res.status(500).json({ message: 'Error updating score' });
  }
});

// Export the app for Vercel
module.exports = app;
