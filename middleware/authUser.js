const jwt = require('jsonwebtoken');

// Middleware to validate JWT token and authenticate the user
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decodedToken.user;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authenticateUser;
  