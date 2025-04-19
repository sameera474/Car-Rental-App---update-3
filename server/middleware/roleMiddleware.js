// File: server/middleware/roleMiddleware.js
const permit = (...allowedRoles) => {
  return (req, res, next) => {
    if (req.user && allowedRoles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden: Access is denied" });
    }
  };
};

module.exports = { permit };
