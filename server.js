const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User'); // Assuming you have a User model
const cors = require('cors');
const http = require('http'); // For creating the HTTP server
const WebSocket = require('ws'); // WebSocket library

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // For parsing application/json

// MongoDB connection using .env variable for consistency
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create an HTTP server to integrate WebSocket
const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); // Attach WebSocket server to HTTP server

// Broadcast function to send updates to all connected clients
const broadcast = (data) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// WebSocket connection event
wss.on('connection', (ws) => {
  console.log('WebSocket connection established!');

  ws.on('message', (message) => {
    console.log('Received message from client:', message);
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed!');
  });
});

// Update score for a user
app.put('/api/user/:userId/score', async (req, res) => {
  const { userId } = req.params;
  const { score } = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, { score }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Broadcast the updated user data to all WebSocket clients
    broadcast({
      type: 'scoreUpdate',
      user,
    });

    res.json({ message: 'Score updated successfully', user });
  } catch (error) {
    console.error('Error updating score:', error);
    res.status(500).json({ message: 'Error updating score' });
  }
});

// Leaderboard route: Get the top users based on their score
app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboard = await User.find().sort({ score: -1 }).limit(10); // Fetch top 10 users sorted by score
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
