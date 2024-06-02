const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = createServer(app);
const io = new Server(server);
const multer=   require('multer');
const jwt = require('jsonwebtoken');
const UserRouterLogin = require("./roots/Authroot.cjs");
const UserRouterRegister = require("./roots/Userroot.cjs");
// const UserRouterProfile = require("./roots/profileRoutes.cjs");
const UserRouterPublication = require("./roots/PubRoute.cjs");
const addpubController = require("./controllers/AddpubController.cjs");
const message = require('./model/message.cjs');
const upload = multer({ dest: "uploads/" });
mongoose
  .connect('mongodb+srv://test:test@testsocket.9bowssb.mongodb.net/')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.log('Error connecting to MongoDB');
  });
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected',socket.id);
});
const userSocketMap = {};

// Function to get socket ID dynamically
const getSocketId = (userId) => {
  return userSocketMap[userId];
};

io.on('connection', (socket) => {
  console.log('a user is connected', socket.id);

  const userId = socket.handshake.query.userId;

  console.log('userid', userId);

  if (userId !== 'undefined') {
    userSocketMap[userId] = socket.id;
  }

  console.log('user socket data', userSocketMap);

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
    delete userSocketMap[userId];
  });

  socket.on('sendMessage', ({ senderId, receiverId, message }) => {
    const receiverSocketId = getSocketId(receiverId);
    console.log('receiverSocketId Id', receiverSocketId);

    console.log('receiver Id', receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', {
        senderId,
        message,
        timeStamp: new Date(),
      });
    }
  });
});


  app.use(UserRouterLogin);
  app.use(UserRouterRegister);
  // app.use(UserRouterProfile);
  app.use(UserRouterPublication);
  app.post('/sendMessage', async (req, res) => {
    try {
      const {senderId, receiverId, message} = req.body;
  
      const newMessage = new message({
        senderId,
        receiverId,
        message,
      });
  
      await newMessage.save();
  
      const receiverSocketId = userSocketMap[receiverId];
  
      if (receiverSocketId) {
        console.log('emitting recieveMessage event to the reciver', receiverId);
        io.to(receiverSocketId).emit('newMessage', newMessage);
      } else {
        console.log('Receiver socket ID not found');
      }
  
      res.status(201).json(newMessage);
    } catch (error) {
      console.log('ERROR', error);
    }
  });
  
  app.get('/messages', async (req, res) => {
    try {
      const {senderId, receiverId} = req.query;
  
      const messages = await message.find({
        $or: [
          {senderId: senderId, receiverId: receiverId},
          {senderId: receiverId, receiverId: senderId},
        ],
      }).populate('senderId', '_id name');
  
      res.status(200).json(messages);
    } catch (error) {
      console.log('Error', error);
    }
  });
  
server.listen(5000, () => {
  console.log('server running at http://localhost:5000');
});