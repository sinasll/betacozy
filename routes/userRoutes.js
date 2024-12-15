const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/user/:username', userController.getUserByUsername); // Get user by username
router.post('/user', userController.createUser); // Create a new user
router.put('/user/:user_id/score', userController.updateUserScore); // Update user score
router.get('/leaderboard', userController.getLeaderboard); // Get leaderboard

module.exports = router;
