const ErrorHandler = require("../utils/errorHandler");

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorHandler("Not authenticated", 401));
    }

    const normalizedUserRole = String(req.user.role || "").trim().toLowerCase();
    const normalizedAllowedRoles = roles.map((role) =>
      String(role).trim().toLowerCase()
    );

    if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to access this resource`,
          403,
        ),
      );
    }

    next();
  };
};
