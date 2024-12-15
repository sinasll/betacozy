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

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const newUser = new User({
      username,
      score: 0, // Default score
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

// Update user score by username
exports.updateUserScore = async (req, res) => {
  try {
    const { score } = req.body;
    const { user_id } = req.params;

    if (score === undefined) {
      return res.status(400).json({ message: 'Score is required' });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.score = score; // Update score
    await user.save();

    res.json({ message: 'Score updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating score', error: err.message });
  }
};

// Get leaderboard (top 10 users)
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find().sort({ score: -1 }).limit(10);
    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching leaderboard', error: err.message });
  }
};
