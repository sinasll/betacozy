const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
require('dotenv').config();

// Load bot token and MongoDB URI from environment variables
const BOT_TOKEN = process.env.BOT_TOKEN || '7939954803:AAG2d3N4hvKlIW3O2tgF95W0TSVOGKY0Cws';
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://sinasll00:123Sina123$@cluster.mongodb.net/cozybetabot';

// Ensure BOT_TOKEN is provided
if (!BOT_TOKEN) {
    console.error('BOT_TOKEN is missing! Add it to your .env file.');
    process.exit(1);
}

// Initialize the bot
const bot = new Telegraf(BOT_TOKEN);

// Connect to MongoDB
mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    });

// Define MongoDB schema and model
const userSchema = new mongoose.Schema({
    userId: { type: Number, required: true, unique: true },
    username: String,
    score: { type: Number, default: 0 },
    lastDaily: Date,
});
const User = mongoose.model('User', userSchema);

// Start command
bot.start(async (ctx) => {
    const userId = ctx.from.id;
    const username = ctx.from.username;

    let user = await User.findOne({ userId });
    if (!user) {
        user = new User({ userId, username });
        await user.save();
    }

    ctx.reply(`Welcome, ${username || 'User'}! Your score is ${user.score}.`);
});

// Daily reward command
bot.command('daily', async (ctx) => {
    const userId = ctx.from.id;
    let user = await User.findOne({ userId });

    if (!user) {
        return ctx.reply('You are not registered. Please start the bot first.');
    }

    const rewardPoints = 25; // Define the reward points

    const now = new Date();
    if (!user.lastDaily || now - user.lastDaily > 24 * 60 * 60 * 1000) {
        user.score += rewardPoints;
        user.lastDaily = now;
        await user.save();
        ctx.reply(`You claimed ${rewardPoints} points! Your total score is now ${user.score}.`);
    } else {
        ctx.reply('You already claimed your daily reward. Come back tomorrow!');
    }
});

// Error handling
bot.catch((err, ctx) => {
    console.error(`Error occurred for ${ctx.updateType}:`, err);
    ctx.reply('An error occurred. Please try again later!');
});

// Start the bot
bot.launch()
    .then(() => console.log('Bot is up and running! 🚀'))
    .catch((err) => console.error('Failed to launch the bot:', err));

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
