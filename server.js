const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const authController = require('./controllers/authController');
const { authMiddleware } = require('./middleware/authMiddleware');
const { createTaskValidator, updateTaskValidator } = require('./validators/taskValidator');
const { createTask, updateTask, deleteTask } = require('./controllers/taskController');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = socketIO(server);

// Connect to MongoDB
mongoose.connect("mongodb+srv://dbUser:KV6QK767WuBmrkb4@cluster0.9zrkk6n.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.json()); // Add the express.json middleware
app.use(cookieParser()); // Add the cookieParser middleware

app.post('/register', authController.register);
app.post('/login', authController.login);
app.post('/tasks', authMiddleware, createTaskValidator, createTask);
app.put('/tasks/:id', authMiddleware, updateTaskValidator, updateTask);
app.delete('/tasks/:id', authMiddleware, deleteTask);

// Socket.io connection event handler
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Handle the event when a client disconnects
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
module.exports = server;