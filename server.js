const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const Message = require('./models/messageModel'); // Make sure this exists

require('dotenv').config();

// Initialize app & server
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});


// Connect MongoDB
connectDB();

// Middleware
app.use(express.static('public'));
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Mongoose fallback connection (optional if connectDB covers it)
mongoose.connect('mongodb://localhost:27017/zidio-task-manager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chats', require('./routes/chatRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/team-members', require('./routes/teamMembers'));
app.use('/api/meetings', require('./routes/meetingRoutes'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/reports', require('./routes/reportRoutes'));


app.get('/api/meetings/room/:adminId-:userId', async (req, res) => {
  const { adminId, userId } = req.params;

  // Generate the room name using adminId and userId
  const roomName = `zidio-room-${adminId}-${userId}`;
  
  // You can store this room in a database if needed, but for now, return it
  res.json({ roomName });
});


app.get('/api/messages/:userId', async(req, res) => {
  const { userId } = req.params;
  const messages = await Message.find({ userId }).sort({ timestamp: 1});
  res.json(messages);
});

app.post ('/api/messages', async (req, res) => {
  const { userId, content, sender } = req.body;
  const newMessage = new Message({
    userId,
    content,
    timestamp: new Date(),
    sender,
  });

  await newMessage.save();
  io.emit('newMessage', newMessage);

  res.status(201).send(newMessage);
});

app.set('io', io);
// Store userId <-> socketId
const userSocketMap = new Map();

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('✅ New client connected');

  socket.on('adminToUserMessage', async (data) => {
    const { roomId, message, sender } = data; 
    const newMessage = new Message({
      roomId: data.roomId,
      sender: data.sender,
      message: data.message
    });

    await newMessage.save();

    io.to(roomId).emit('receiveMessage', newMessage);
  });

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`Joined room: ${roomId}`);
  });

  socket.on('sendMessage', (message) => {
    io.emit('newMessage', message);
  });


  // Register user
  socket.on('register', (userId) => {
    userSocketMap.set(userId, socket.id);
    socket.userId = userId;
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  // Send message & save
  socket.on('send-message', async ({ toUserId, fromUserId, message }) => {
    const newMsg = new Message({ toUserId, fromUserId, message });
    await newMsg.save();

    const targetSocket = userSocketMap.get(toUserId);
    if (targetSocket) {
      io.to(targetSocket).emit('receive-message', {
        fromUserId,
        message,
        timestamp: newMsg.timestamp,
      });
    }
  });

  // Send notification from Admin
  socket.on('send-notification', ({ userId, message }) => {
    const targetSocketId = userSocketMap.get(userId);
    if (targetSocketId) {
      io.to(targetSocketId).emit('notification', { message });
    }
  });

  // Typing indicator
  socket.on('typing', ({ toUserId, fromUserId }) => {
    const targetSocket = userSocketMap.get(toUserId);
    if (targetSocket) {
      io.to(targetSocket).emit('typing', { fromUserId });
    }
  });

  socket.on('register', (userId) => {
    console.log(`✅ Registered: ${userId}`);
    socket.userId = userId;
  });

  socket.on('getMessages', async (data) => {
    const messages = await Message.find({ roomId: data.roomId }).sort({ createdAt: 1 });
    socket.emit('chatHistory', messages);
  });
  

  // Disconnect cleanup
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected');
    for (let [userId, socketId] of userSocketMap) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  });
});

// REST API to fetch messages
app.get('/api/messages/:userId1/:userId2', async (req, res) => {
  const { userId1, userId2 } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { fromUserId: userId1, toUserId: userId2 },
        { fromUserId: userId2, toUserId: userId1 },
      ],
    }).sort('timestamp');

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});