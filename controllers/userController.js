const User = require('../models/User');

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

exports.createUser = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        const newUser = new User({ username, score: 0 });
        await newUser.save();

        res.status(201).json(newUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
};

exports.updateUserScore = async (req, res) => {
    try {
        const user = await User.findById(req.params.user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.body.score !== undefined) {
            user.score = req.body.score;
        } else {
            user.score += 1;
        }

        await user.save();
        res.json({ message: 'Score updated successfully', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating score', error: err.message });
    }
};

exports.getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.find().sort({ score: -1 }).limit(10);
        res.json(leaderboard);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching leaderboard', error: err.message });
    }
};
