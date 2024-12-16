const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');  // Assuming you have a User model
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());  // For parsing application/json

// MongoDB connection using .env variable for consistency
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

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

// Get leaderboard - fetch users sorted by score
app.get('/api/leaderboard', async (req, res) => {
    try {
        // Fetch users and sort by score in descending order, limiting to top 10
        const leaderboard = await User.find().sort({ score: -1 }).limit(10); // Adjust limit as needed
        res.json(leaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Error fetching leaderboard' });
    }
});

// Start server
app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port 3000');
});
