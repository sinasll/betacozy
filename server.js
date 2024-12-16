const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());  // For parsing application/json

// MongoDB connection using .env variable for consistency
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the homepage!');
});

// API routes
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
        res.status(500).json({ message: 'Error updating score' });
    }
});

// Leaderboard route
app.get('/api/leaderboard', async (req, res) => {
    try {
        const leaderboard = await User.find().sort({ score: -1 }).limit(10);
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leaderboard' });
    }
});

// Export the function for Vercel
module.exports = (req, res) => {
  app(req, res);
};