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
    res.status(500).json({ message: 'Error fetching user', error: err });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      score: 0, // Initial score
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err });
  }
};

// Update user score
exports.updateUserScore = async (req, res) => {
  try {
    const user = await User.findById(req.params.user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.score = req.body.score;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error updating score', error: err });
  }
};

// Get leaderboard (sorted by score)
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find().sort({ score: -1 }).limit(10);
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching leaderboard', error: err });
  }
};
