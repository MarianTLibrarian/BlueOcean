const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const compression = require('compression');

const app = express();
const server = http.createServer(app);

const { Server } = require('socket.io');

require('dotenv').config();

// const morgan = require('morgan');
const PORT = process.env.PORT || 3030;
const router = require('./routes');

app.use(cors());
app.use(express.json());
app.use(compression());
app.use(express.static(path.join(__dirname, '../client/pages')));
app.use('/', router);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join_room', (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

server.listen(PORT, () => console.info(`Server listening on port ${PORT}\n`));
