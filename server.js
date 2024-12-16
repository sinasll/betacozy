const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');  // Assuming you have a User model
const cors = require('cors');
const path = require('path');  // For serving static files

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());  // For parsing application/json
app.use(express.static(path.join(__dirname, 'public')));  // Serve static files

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

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

// Leaderboard route: Get the top users based on their score
app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboard = await User.find().sort({ score: -1 }).limit(10); // Fetch top 10 users
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

// Export the app for Vercel (important for deployment)
module.exports = app;