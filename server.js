require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const taskController = require('./controllers/taskController');
const authController = require('./controllers/authController');
const authMiddleware = require('./middleware/authMiddleware');
const taskValidator = require('./validators/taskValidator');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = socketIO(server);

// Connect to MongoDB
mongoose.connect( MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(express.json())  // Add the express.json middleware
app.use(cookieParser()); // Add the cookieParser middleware


app.post('/register', authController.register);
app.post('/login', authController.login);
app.post('/tasks', authMiddleware, taskValidator.createTaskValidator, taskController.createTask);
app.put('/tasks/:id', authMiddleware, taskValidator.updateTaskValidator, taskController.updateTask);
app.delete('/tasks/:id', authMiddleware, taskController.deleteTask);

// Socket.io connection event handler
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
  
    // Handle the event when a client disconnects
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
