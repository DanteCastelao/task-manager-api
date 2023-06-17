const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware for token authentication and authorization
exports.authMiddleware = async (req, res, next) => {
  try {
    // Get the token from the request cookies
    const token = req.headers.authorization;

    // Check if the token exists
    if (!token) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Find the user associated with the token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Attach the user object to the request
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
