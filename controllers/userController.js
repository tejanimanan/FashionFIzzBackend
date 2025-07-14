const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// You should store this secret in an environment variable
const JWT_SECRET = 'your_jwt_secret_key';

// Register User
exports.registerUser = async (req, res) => {
  try {
    const lastuser = await User.findOne().sort({ id: -1 });
         const newId = lastuser ? parseInt(lastuser.id) + 2 : 1;
    const { name, email, password,phone,address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    // console.log("data ===",req.body)

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const newUser = new User({
      id:newId.toString(),
      name,
      email,
      password: hashedPassword,
      phone,
      address
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT Token
    // const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
    //   expiresIn: '1d'
    // });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role:user.role || 'customer'
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findOne({ id: userId }).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
//get all user for admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password field

    res.status(200).json(users);
  } catch (error) {
    console.error('Get All Users Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const { name, email, phone, address } = req.body;

    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if they exist in the body
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = Array.isArray(phone) ? phone : [phone];
    if (address) user.address = Array.isArray(address) ? address : [address];

    await user.save();

    res.json({ message: 'Profile updated successfully', user });

  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


