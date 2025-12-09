// authController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Register user
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "All fields required" });

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(409).json({ error: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    req.session.userId = newUser._id; // set session
    res.status(200).json({ message: "Registered", user: { id: newUser._id, name, email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login user
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "All fields required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    req.session.userId = user._id; // set session
    res.status(200).json({ message: "Logged in", user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Logout user
export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.clearCookie("ft.sid");
    res.status(200).json({ message: "Logged out" });
  });
};

// Get current logged in user
export const getMe = async (req, res) => {
  if (!req.session.userId) return res.json({ user: null });
  const user = await User.findById(req.session.userId);
  if (!user) return res.json({ user: null });
  res.json({ user: { id: user._id, name: user.name, email: user.email } });
};
