const { body } = require('express-validator');

exports.createTaskValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('dueDate').isISO8601().withMessage('Invalid due date'),
  // Add validation rules for additional fields
  body('priority').isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority'),
  body('status').isIn(['Todo', 'In Progress', 'Completed']).withMessage('Invalid status'),
  body('tags').isArray().withMessage('Tags must be an array'),
];

exports.updateTaskValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('dueDate').isISO8601().withMessage('Invalid due date'),
  // Add validation rules for additional fields
  body('priority').isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority'),
  body('status').isIn(['Todo', 'In Progress', 'Completed']).withMessage('Invalid status'),
  body('tags').isArray().withMessage('Tags must be an array'),
];
