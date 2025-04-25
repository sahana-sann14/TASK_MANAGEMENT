const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @desc Login user
exports.loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Normalize role
    const normalizedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (user.role !== normalizedRole) {
      return res.status(403).json({ message: 'Invalid role selection' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET , {
      expiresIn: '1d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // set to true in production with HTTPS
      sameSite: 'Lax',
    });

    const { password: pwd, ...userData } = user._doc;
    res.json({ success: true, token, user: userData });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Get all users (admin only)
exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

// @desc Signup user
exports.signupUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const formattedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: formattedRole,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
