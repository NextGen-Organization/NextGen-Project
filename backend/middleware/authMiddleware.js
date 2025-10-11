const jwt = require('jsonwebtoken');

// Use same default secret as authController so signing and verification match when
// process.env.JWT_SECRET is not set (e.g. local development / tests).
const JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';

exports.requireAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Missing token' });
  const token = auth.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = payload;
    next();
  });
};

exports.requireRole = (role) => (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Missing token' });
  const token = auth.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    if (payload.role !== role) return res.status(403).json({ message: 'Forbidden' });
    req.user = payload;
    next();
  });
};
