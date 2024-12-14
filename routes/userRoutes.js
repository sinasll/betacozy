// routes/userRoutes.js

const express = require('express');
const userController = require('../controllers/userController'); // Import the user controller
const router = express.Router();

// Define your routes
router.get('/user/:username', userController.getUserByUsername);
router.post('/user', userController.createUser); // Create user route
router.put('/user/:user_id/score', userController.updateUserScore);
router.get('/leaderboard', userController.getLeaderboard);

module.exports = router;
