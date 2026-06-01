const jwt = require('jsonwebtoken');

/**
 * Route protection middleware to verify JWT Access Token
 * Expects header: "Authorization: Bearer <token>"
 */
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Expecting format: "Bearer <token>"
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Invalid token format. Expecting: Bearer <token>' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access denied. Token is empty.' });
    }

    // Verify token using secret key
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET || 'fallback_access_secret_123'
    );

    // Bind decoded user payload to request context
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Authentication failed. Token has expired.' });
    }
    return res.status(401).json({ error: 'Authentication failed. Invalid token.' });
  }
};

module.exports = verifyToken;
