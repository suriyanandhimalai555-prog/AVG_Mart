import jwt from "jsonwebtoken";

// Middleware to protect routes and verify logged-in users
export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attaches { id, role } parameters to request context
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token trace." });
  }
};

// Middleware to restrict routes exclusively to admin users
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
};