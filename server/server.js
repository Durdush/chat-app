const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const mongo = require('./utils/mongo');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.');
    }
   
    socket.join(params.room);
    mongo.addUser(params,socket.id);
    // socket.leave('Group name');

    // io.emit -> io.to('RoomA').emit
    // socket.broadcast.emit -> socket.broadcast.to('RoomB').emit
    // socket.emit
    // console.log(socket);

    socket.emit('newMessage', generateMessage('Admin','heyji' ,'Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', 'yoji',`${params.name} has joined.`));
    callback();
  });

  // socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  // socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));



  socket.on('createMessage', (message, callback) => {
    // console.log('createMessage', message);
    var msg = generateMessage(message.from, message.to, message.text);
    console.log(socket.id);
    mongo.addMessage(msg);
    mongo.searchById(socket.id).then((room)=>{
      io.to(room).emit('newMessage',msg);
    });
    
      // io.to(room).emit('newMessage',msg);
    // console.log(room);
    // io.to(room).emit('newMessage',msg);
    callback();
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

  socket.on('disconnect', () => {
     mongo.removeUser(socket.id)
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
