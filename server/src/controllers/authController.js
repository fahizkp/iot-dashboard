const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { jwtSecret, jwtExpiresIn, adminUsername, adminPassword, nodeEnv } = require('../config/env');

// Admin login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check username
    if (username !== adminUsername) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password (compare with hashed password from env)
    const isMatch = await bcrypt.compare(password, adminPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { username: adminUsername },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );

    // Set cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000 // 8 hours
    };

    // Send response with cookie
    res.cookie('token', token, cookieOptions);
    res.json({
      success: true,
      message: 'Login successful',
      expiresIn: jwtExpiresIn
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// Admin logout
const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};

// Verify session
const verify = (req, res) => {
  res.json({
    success: true,
    authenticated: true,
    username: req.admin.username
  });
};

module.exports = {
  login,
  logout,
  verify
};
