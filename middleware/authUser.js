const jwt = require('jsonwebtoken');

// Middleware to validate JWT token and authenticate the user
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    try {
      const decodedToken = jwt.verify(token, 'my-secret'); // Replace 'your-secret-key' with your own secret key
      req.user = decodedToken.user;
      next();
    } catch (error) {
      console.error('Error authenticating user:', error);
      res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authenticateUser;
  