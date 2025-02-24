require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const Message = require('./models/Message');
const { default: axios } = require('axios');

if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in the environment variables.');
  process.exit(1);
}
if (!process.env.PORT) {
  console.error('Error: PORT is not defined in the environment variables.');
  process.exit(1);
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

let activeUsers = new Map();


const validateMessage = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  if ((text.match(urlRegex) || []).length > 2) return false;

  const harmfulPatterns = /\b(hack|crack|spam|scam|phish)\b/i;
  if (harmfulPatterns.test(text)) return false;

  return true;
};


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });


const getRecentMessages = async () => {
  try {
    return await Message.find().sort({ timestamp: -1 }).limit(50);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

// API to get messages
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await getRecentMessages();
    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});


const getRandomAvatar = (username) => {
  const styles = ['adventurer', 'bottts', 'big-smile', 'micah', 'thumbs', 'avataaars'];
  const randomStyle = styles[Math.floor(Math.random() * styles.length)];
  return `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${encodeURIComponent(username)}`;
};


io.on('connection', async (socket) => {
  console.log(`User connected: ${socket.id}`);


  const messages = await getRecentMessages();
  socket.emit('load-messages', messages.reverse());

  socket.on('user-joined', async (userData) => {
    try {
      userData.name = userData.name || 'Anonymous';
      userData.profileImage = userData.profileImage || getRandomAvatar(userData.name);

      activeUsers.set(socket.id, {
        ...userData,
        id: socket.id,
      });

      io.emit('active-users-update', Array.from(activeUsers.values()));
      io.emit('active-count', activeUsers.size);
    } catch (error) {
      console.error('Error setting user:', error);
    }
  });

  socket.on('send-chat-message', async (messageData) => {
    try {
      const user = activeUsers.get(socket.id);
      if (!user || !validateMessage(messageData.text)) return;

      const message = new Message({
        text: messageData.text,
        user: user,
        timestamp: new Date(),
      });

      await message.save();
      io.emit('chat-message', message);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', 'Failed to send message');
    }
  });

  socket.on('disconnect', () => {
    activeUsers.delete(socket.id);
    io.emit('active-users-update', Array.from(activeUsers.values()));
    io.emit('active-count', activeUsers.size);
    console.log(`User disconnected: ${socket.id}`);
  });
});


const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
