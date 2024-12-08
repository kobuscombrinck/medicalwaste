// Placeholder auth middleware for development
// TODO: Implement proper JWT authentication

const authenticate = (req, res, next) => {
  // For development, we'll add a mock user to the request
  req.user = {
    _id: '123456789',
    name: 'Test User',
    role: 'admin'
  };
  next();
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized'
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize
};
