const io = require('socket.io')();
const { validationResult } = require('express-validator');
const Task = require('../models/task');

// Create a task
exports.createTask = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await Task.create(req.body);

    // Emit the event to update clients about the new task
    io.emit('taskCreated', task);

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Find the task by ID
    const task = await Task.findByIdAndUpdate(id, req.body, { new: true });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Emit the event to update clients about the updated task
    io.emit('taskUpdated', task);

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the task by ID and remove it
    const task = await Task.findByIdAndRemove(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Emit the event to update clients about the deleted task
    io.emit('taskDeleted', task);

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
