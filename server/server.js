// server.js - Main server file for Socket.io chat application

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Store connected users, messages, and rooms
const users = {};
const messages = {};
const typingUsers = {};
const rooms = ['general', 'random', 'tech'];

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Initialize messages for rooms if not exists
  rooms.forEach(room => {
    if (!messages[room]) messages[room] = [];
  });

  // Handle user joining
  socket.on('user_join', ({ username, room = 'general' }) => {
    socket.join(room);
    users[socket.id] = { username, id: socket.id, room };

    // Send room-specific data
    socket.emit('room_messages', messages[room] || []);
    io.to(room).emit('user_list', Object.values(users).filter(u => u.room === room));
    io.to(room).emit('user_joined', { username, id: socket.id });
    console.log(`${username} joined room: ${room}`);
  });

  // Handle chat messages
  socket.on('send_message', (messageData) => {
    const user = users[socket.id];
    if (!user) return;

    const message = {
      ...messageData,
      id: Date.now(),
      sender: user.username,
      senderId: socket.id,
      timestamp: new Date().toISOString(),
      reactions: {},
      readBy: [user.username],
    };

    const roomMessages = messages[user.room] || [];
    roomMessages.push(message);

    // Limit stored messages to prevent memory issues
    if (roomMessages.length > 100) {
      roomMessages.shift();
    }

    messages[user.room] = roomMessages;
    io.to(user.room).emit('receive_message', message);
  });

  // Handle typing indicator
  socket.on('typing', (isTyping) => {
    const user = users[socket.id];
    if (!user) return;

    if (isTyping) {
      typingUsers[socket.id] = user.username;
    } else {
      delete typingUsers[socket.id];
    }

    io.to(user.room).emit('typing_users', Object.values(typingUsers));
  });

  // Handle private messages
  socket.on('private_message', ({ to, message }) => {
    const user = users[socket.id];
    if (!user) return;

    const messageData = {
      id: Date.now(),
      sender: user.username,
      senderId: socket.id,
      message,
      timestamp: new Date().toISOString(),
      isPrivate: true,
    };

    socket.to(to).emit('private_message', messageData);
    socket.emit('private_message', messageData);
  });

  // Handle room switching
  socket.on('switch_room', (newRoom) => {
    const user = users[socket.id];
    if (!user || !rooms.includes(newRoom)) return;

    const oldRoom = user.room;
    socket.leave(oldRoom);
    socket.join(newRoom);
    user.room = newRoom;

    // Send room-specific data
    socket.emit('room_messages', messages[newRoom] || []);
    io.to(newRoom).emit('user_list', Object.values(users).filter(u => u.room === newRoom));
    io.to(oldRoom).emit('user_list', Object.values(users).filter(u => u.room === oldRoom));

    console.log(`${user.username} switched from ${oldRoom} to ${newRoom}`);
  });

  // Handle message reactions
  socket.on('add_reaction', ({ messageId, emoji }) => {
    const user = users[socket.id];
    if (!user) return;

    const roomMessages = messages[user.room] || [];
    const message = roomMessages.find(m => m.id === messageId);
    if (message) {
      if (!message.reactions[emoji]) {
        message.reactions[emoji] = [];
      }
      if (!message.reactions[emoji].includes(user.username)) {
        message.reactions[emoji].push(user.username);
      }
      io.to(user.room).emit('message_updated', message);
    }
  });

  // Handle read receipts
  socket.on('mark_as_read', (messageId) => {
    const user = users[socket.id];
    if (!user) return;

    const roomMessages = messages[user.room] || [];
    const message = roomMessages.find(m => m.id === messageId);
    if (message && !message.readBy.includes(user.username)) {
      message.readBy.push(user.username);
      io.to(user.room).emit('message_updated', message);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      io.to(user.room).emit('user_left', { username: user.username, id: socket.id });
      console.log(`${user.username} left room: ${user.room}`);
    }

    delete users[socket.id];
    delete typingUsers[socket.id];

    // Update user lists for all rooms
    rooms.forEach(room => {
      io.to(room).emit('user_list', Object.values(users).filter(u => u.room === room));
      io.to(room).emit('typing_users', Object.values(typingUsers));
    });
  });
});

// API routes
app.get('/api/messages/:room?', (req, res) => {
  const room = req.params.room || 'general';
  res.json(messages[room] || []);
});

app.get('/api/users/:room?', (req, res) => {
  const room = req.params.room || 'general';
  res.json(Object.values(users).filter(u => u.room === room));
});

app.get('/api/rooms', (req, res) => {
  res.json(rooms);
});

// Root route
app.get('/', (req, res) => {
  res.send('Socket.io Chat Server is running');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io }; 