// models/User.js

const mongoose = require('mongoose');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  user_id: {
    type: String,  // Changed to String for uniqueness
    required: true,
    unique: true,  // Ensure that each user has a unique ID
  },
  username: {
    type: String,
    required: true,  // Username is required
    unique: true,    // Ensure that the username is unique
    trim: true,      // Removes any extra spaces before/after the username
    minlength: 3,    // Ensure the username is at least 3 characters
    maxlength: 30,   // Ensure the username is no longer than 30 characters
  },
  score: {
    type: Number,
    default: 0,  // The default score will be 0 if not specified
  },
  joinedAt: {
    type: Date,
    default: Date.now,  // Automatically sets the current date/time when the user is created
  },
  lastClaimedReward: {
    type: Date,
    default: null,  // Null if the user hasn't claimed any rewards yet
  },
  rewardClaimedToday: {
    type: Boolean,
    default: false,  // Whether the user has claimed their daily reward
  },
});

// Create the User model using the schema
const User = mongoose.model('User', userSchema);

// Export the User model to be used in other files
module.exports = User;
