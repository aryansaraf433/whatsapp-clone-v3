const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.static('frontend'));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

let users = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (username) => {
    users[socket.id] = username;
    socket.broadcast.emit('user-connected', username);
  });

  socket.on('private-message', ({ to, message, from, time, type }) => {
    const targetSocket = Object.keys(users).find(id => users[id] === to);
    if (targetSocket) {
      io.to(targetSocket).emit('receive-message', {
        from, message, time, type
      });
    }
  });

  socket.on('disconnect', () => {
    const username = users[socket.id];
    delete users[socket.id];
    socket.broadcast.emit('user-disconnected', username);
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const cors = require("cors");
app.use(cors({
  origin: "*", // or set to your frontend origin
  methods: ["GET", "POST"]
}));
