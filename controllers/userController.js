// controllers/userController.js

const User = require('../models/User'); // Import the User model

// Get user by username
exports.getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const newUser = new User({
      username: username,
      score: 0, // Initial score
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

// Update user score (increment or set to a specific value)
exports.updateUserScore = async (req, res) => {
  try {
    const user = await User.findById(req.params.user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If req.body.score exists, set the score to that value
    if (req.body.score !== undefined) {
      user.score = req.body.score;  // Set score to the value provided
    } else {
      // Otherwise, increment the score by 1 (or any other logic you want)
      user.score += 1;  // Change this increment logic as needed
    }

    await user.save();
    res.json({ message: 'Score updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating score', error: err.message });
  }
};

// Get leaderboard (sorted by score, top 10 users)
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find().sort({ score: -1 }).limit(10);
    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching leaderboard', error: err.message });
  }
};
