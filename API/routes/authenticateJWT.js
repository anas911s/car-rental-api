const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'anas_911';

const authenticateJWT = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(403).json({ message: 'Access denied. No token provided.' });
    }
  
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(403).json({ message: 'Access denied. No token provided.' });
    }
    
    const decodedToken = jwt.decode(token);
    console.log('Decoded Token:', decodedToken);

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token.' });
      }
      req.user = decoded;
      next();
    });
  };
  

module.exports = authenticateJWT;
