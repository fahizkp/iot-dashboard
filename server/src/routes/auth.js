const express = require('express');
const router = express.Router();
const { login, logout, verify } = require('../controllers/authController');
const { loginValidation, validate } = require('../middleware/validation');
const authMiddleware = require('../middleware/auth');

// POST /api/auth/login - Admin login
router.post('/login', loginValidation, validate, login);

// POST /api/auth/logout - Admin logout
router.post('/logout', logout);

// GET /api/auth/verify - Verify session (protected)
router.get('/verify', authMiddleware, verify);

module.exports = router;
