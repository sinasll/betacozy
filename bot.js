const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('./db');  // Your database connection file
const User = require('./models/User');  // Import your User model
require('dotenv').config();

// Initialize the bot
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// When the user sends /start
bot.onText(/\/start/, async (msg) => {
  const userId = msg.from.id.toString();  // User ID (Telegram ID)
  const username = msg.from.username || 'Unknown';  // Use the username or 'Unknown' if not available
  
  try {
    // Check if the user already exists in the database
    let user = await User.findOne({ user_id: userId });

    // If the user doesn't exist, create a new record
    if (!user) {
      user = new User({
        user_id: userId,
        username: username,
        score: 0,  // Initialize score to 0 if you track it
      });
      await user.save();  // Save the new user to the database
    }

    // Send a welcome message to the user
    bot.sendMessage(userId, `Welcome to $COZYt, ${username}! Your current score is ${user.score}.`);
  } catch (error) {
    console.error('Error handling /start command:', error);
    bot.sendMessage(userId, 'Something went wrong while registering your account. Please try again later!');
  }
});
