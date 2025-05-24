const jwt = require("jsonwebtoken");
require("dotenv").config();
const db = require("../models/db");

exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user to check if admin
    const userResult = await db.query("SELECT * FROM users WHERE user_id = $1", [decoded.userId]);
    const user = userResult.rows[0];

    if (!user) return res.status(403).json({ error: "User not found" });

    req.user = user; // attach user info to request
    next();
  } catch (err) {
    console.error("Token Error:", err);
    res.status(403).json({ error: "Invalid token" });
  }
};

exports.requireAdmin = (req, res, next) => {
  if (!req.user?.is_admin) {
    return res.status(403).json({ error: "Access denied: Admins only" });
  }
  next();
};
