require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const sanitizeHtml = require('sanitize-html');
const Message = require('./models/Message');

if (!process.env.MONGO_URI || !process.env.PORT) {
  console.error('Error: MONGO_URI and PORT must be defined in .env');
  process.exit(1);
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || '*' },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

// MongoDB Connection
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

// Message Schema Index for Efficient Sorting
Message.collection.createIndex({ timestamp: -1 });

// Rate Limiting for Socket Events (per IP)
const messageRateLimit = new Map();
const typingRateLimit = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_MESSAGES_PER_WINDOW = 20;
const MAX_TYPING_EVENTS_PER_WINDOW = 30;

// Input Validation and Sanitization
const validateMessage = (text) => {
  if (!text || text.length > 255) return false;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  if ((text.match(urlRegex) || []).length > 2) return false;
  const harmfulPatterns = /\b(hack|crack|spam|scam|phish)\b/i;
  return !harmfulPatterns.test(text);
};

const sanitizeMessage = (text) => {
  return sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {},
  });
};

// Active Users Management
const activeUsers = new Map();

// Socket.IO Handlers
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Rate Limit Middleware
  socket.use((packet, next) => {
    const clientIp = socket.handshake.address;
    const now = Date.now();
    if (packet[0] === 'send-chat-message') {
      const userLimit = messageRateLimit.get(clientIp) || { count: 0, resetTime: now };
      if (now > userLimit.resetTime) {
        userLimit.count = 0;
        userLimit.resetTime = now + RATE_LIMIT_WINDOW;
      }
      if (userLimit.count >= MAX_MESSAGES_PER_WINDOW) {
        return socket.emit('error', 'Message rate limit exceeded. Try again later.');
      }
      userLimit.count++;
      messageRateLimit.set(clientIp, userLimit);
    } else if (packet[0] === 'typing-start' || packet[0] === 'typing-stop') {
      const userLimit = typingRateLimit.get(clientIp) || { count: 0, resetTime: now };
      if (now > userLimit.resetTime) {
        userLimit.count = 0;
        userLimit.resetTime = now + RATE_LIMIT_WINDOW;
      }
      if (userLimit.count >= MAX_TYPING_EVENTS_PER_WINDOW) {
        return;
      }
      userLimit.count++;
      typingRateLimit.set(clientIp, userLimit);
    }
    next();
  });

  // Load Recent Messages
  socket.on('request-messages', async ({ page = 0, limit = 20 }, callback) => {
    try {
      const skip = page * limit;
      const messages = await Message.find()
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
      const totalCount = await Message.countDocuments();
      callback({
        messages: messages.reverse(),
        hasMore: skip + limit < totalCount,
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
      callback({ error: 'Failed to load messages' });
    }
  });

  // Handle User Join
  socket.on('user-joined', (userData) => {
    try {
      userData.name = userData.name?.trim() || 'Anonymous';
      userData.profileImage = userData.profileImage || getRandomAvatar(userData.name);
      socket.user = { ...userData, id: socket.id };
      activeUsers.set(socket.id, socket.user);
      io.emit('active-users-update', Array.from(activeUsers.values()));
      io.emit('chat-message', {
        text: `${userData.name} joined the chat`,
        user: { id: 'system', name: 'System', profileImage: getRandomAvatar('system') },
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Error setting user:', error);
      socket.emit('error', 'Failed to join chat');
    }
  });

  // Handle Typing Events
  socket.on('typing-start', () => {
    if (socket.user) {
      socket.broadcast.emit('user-typing', socket.user);
    }
  });

  socket.on('typing-stop', () => {
    if (socket.user) {
      socket.broadcast.emit('user-stopped-typing', socket.user);
    }
  });

  // Handle New Message
  socket.on('send-chat-message', async (messageData, callback) => {
    try {
      if (!socket.user || !validateMessage(messageData.text)) {
        return callback({ error: 'Invalid message' });
      }
      const sanitizedText = sanitizeMessage(messageData.text);
      const message = new Message({
        text: sanitizedText,
        user: socket.user,
        timestamp: new Date(),
      });
      await message.save();
      io.emit('chat-message', message);
      callback({ status: 'success', message });
    } catch (error) {
      console.error('Error sending message:', error);
      callback({ error: 'Failed to send message' });
    }
  });

  // Handle Disconnect
  socket.on('disconnect', () => {
    if (socket.user) {
      activeUsers.delete(socket.id);
      io.emit('active-users-update', Array.from(activeUsers.values()));
      io.emit('chat-message', {
        text: `${socket.user.name} left the chat`,
        user: { id: 'system', name: 'System', profileImage: getRandomAvatar('system') },
        timestamp: new Date(),
      });
      socket.broadcast.emit('user-stopped-typing', socket.user);
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

// API to Get Messages
app.get('/api/messages', async (req, res) => {
  try {
    const { page = 0, limit = 20 } = req.query;
    const skip = parseInt(page) * parseInt(limit);
    const messages = await Message.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    const totalCount = await Message.countDocuments();
    res.json({
      messages: messages.reverse(),
      hasMore: skip + parseInt(limit) < totalCount,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Random Avatar Generator
const getRandomAvatar = (username) => {
  const styles = ['adventurer', 'bottts', 'micah', 'avataaars'];
  const randomStyle = styles[Math.floor(Math.random() * styles.length)];
  return `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${encodeURIComponent(username)}`;
};

// Start Server
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});