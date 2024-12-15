const express = require('express');
const userController = require('../controllers/userController'); // Import the user controller
const router = express.Router();

// Define routes
router.get('/user/:username', userController.getUserByUsername); // Get user by username
router.post('/user', userController.createUser); // Create user
router.put('/user/:user_id/score', userController.updateUserScore); // Update score by user ID
router.get('/leaderboard', userController.getLeaderboard); // Get leaderboard

module.exports = router;
