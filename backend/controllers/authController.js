const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateToken = (id, role) => {
  return jwt.sign(
    { userId: id, role: role },
    process.env.JWT_SECRET,
    { expiresIn: '3d' }
  );
};
exports.registerUser = async (req, res) => {
  try {
    const { username, password, role, committee } = req.body;
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    user = new User({
      username,
      password,
      role,
      committee,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.status(201).json({
      message: 'User registered successfully',
      userId: user._id,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
exports.loginUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    if (user.role !== role) {
      return res.status(400).json({ message: `You are not registered as a ${role}` });
    }
    const token = generateToken(user._id, user.role);
    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        _id: user._id,
        username: user.username,
        role: user.role,
        committee: user.committee,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
