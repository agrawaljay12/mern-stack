import jwt from "jsonwebtoken";
import crypto from "crypto";

const get_required_roles = (roles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }
      if (roles.includes(req.user.role)) return next();
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
};

const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      req.user = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET_KEY);
    }
  } catch {
    // Invalid JWT is treated as anonymous.
  }
  next();
};

const ensureGuestToken = (req, res, next) => {
  const existing = req.headers["x-guest-token"];
  const token = typeof existing === "string" && existing.trim()
    ? existing.trim()
    : crypto.randomUUID();

  req.guestToken = token;
  res.setHeader("X-Guest-Token", token);
  next();
};

export { get_required_roles, optionalAuth, ensureGuestToken };
