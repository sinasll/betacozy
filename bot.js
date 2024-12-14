const mongoose = require('./db');  // Import your db.js connection
const TelegramBot = require('node-telegram-bot-api');
const User = require('./models/User');  // Import your User model
require('dotenv').config();

// Initialize the bot
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// When the user sends /start
bot.onText(/\/start/, async (msg) => {
  const userId = msg.from.id.toString();  // User ID (Telegram ID)
  const username = msg.from.username || 'Unknown';  // Use the username or 'Unknown' if not available
  
  // Check if the user already exists in the database
  let user = await User.findOne({ user_id: userId });

  // If the user doesn't exist, create a new record
  if (!user) {
    user = new User({
      user_id: userId,
      username: username,
    });
    await user.save();  // Save the new user to the database
  }

  // Send a welcome message to the user
  bot.sendMessage(userId, 'Welcome to the $COZYt!');
});
