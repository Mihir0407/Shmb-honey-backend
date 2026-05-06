const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const zxcvbn = require("zxcvbn");

const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const authLimiter = require("../middleware/rateLimit");

const router = express.Router();

const signToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, agree } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields required" });

    if (!agree)
      return res.status(400).json({ message: "Accept terms & privacy policy" });

    const strength = zxcvbn(password);
    if (strength.score < 3)
      return res.status(400).json({
        message: "Password too weak. Use numbers & symbols.",
      });

    const normalizedEmail = email.toLowerCase().trim();
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hash,
       role: "user",
    });

    res.json({
      token: signToken(user),
      user: { id: user._id, name: user.name, email: user.email , role: user.role},
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      token: signToken(user),
      user: { id: user._id, name: user.name, email: user.email ,role : user.role },
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ME
router.get("/me", protect, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});
module.exports = router;
