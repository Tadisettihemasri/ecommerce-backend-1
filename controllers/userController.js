const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/db");
require("dotenv").config();

exports.registerUser = async (req, res) => {
  const { userId, password, mobile_no, address, is_admin } = req.body;
  try {
    const userExists = await db.query(
      "SELECT * FROM users WHERE user_id = $1",
      [userId]
    );

    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPwd = await bcrypt.hash(password, 10);
    if (typeof is_admin === 'boolean') {
      await db.query(
        `INSERT INTO users (user_id, password, mobile_no, address, is_admin)
         VALUES ($1, $2, $3, $4, $5)`,
        [userId, hashedPwd, mobile_no, address, is_admin]
      );
    } else {
      await db.query(
        `INSERT INTO users (user_id, password, mobile_no, address, is_admin)
        VALUES ($1, $2, $3, $4, $5)`,
        [userId, hashedPwd, mobile_no, address, false]
      );
    }

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }

};

exports.loginUser = async (req, res) => {
  const { userId, password } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE user_id = $1", [userId]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      user: {
        userId: user.user_id,
        isAdmin: user.is_admin
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }

};




