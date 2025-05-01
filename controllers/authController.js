const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Basic validation
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }

  try {
    // Check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create and save the user (Mongoose pre-save will hash the password)
    const user = await User.create({ name, email, password });

    res.status(201).json({ message: 'User Registered Successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration Failed', error: err.message });
  }
};

// controllers/authController.js
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'Invalid Credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(403).json({ message: 'Invalid Credentials' });

  // ✅ Include name in the token payload
  const token = jwt.sign(
    { id: user._id, role: user.role, name: user.name }, // include name
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ message: 'Login Success', token });
};

