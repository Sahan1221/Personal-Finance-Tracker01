const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();
const SALT_ROUNDS = 10;

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({ name, email, password: hashed });
    await user.save();

    // create session
    req.session.userId = user._id;
    req.session.userName = user.name;

    res.json({ message: 'Registered', user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    req.session.userId = user._id;
    req.session.userName = user.name;

    res.json({ message: 'Logged in', user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  try {
    req.session.destroy(err => {
      if (err) {
        console.error('Session destroy error', err);
        return res.status(500).json({ error: 'Could not log out' });
      }
      res.clearCookie(process.env.SESSION_NAME || 'ft.sid');
      res.json({ message: 'Logged out' });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
router.get('/me', (req, res) => {
  if (req.session && req.session.userId) {
    return res.json({ user: { id: req.session.userId, name: req.session.userName } });
  }
  return res.status(200).json({ user: null });
});

module.exports = router;
