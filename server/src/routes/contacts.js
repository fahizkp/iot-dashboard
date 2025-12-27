const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  createContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
  getStats
} = require('../controllers/contactController');
const { contactValidation, updateContactValidation, validate } = require('../middleware/validation');
const authMiddleware = require('../middleware/auth');

// Rate limiter for contact form submissions
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour per IP
  message: {
    success: false,
    message: 'Too many submissions. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Public routes
// POST /api/contacts - Submit contact form
router.post('/', contactLimiter, contactValidation, validate, createContact);

// Protected routes (admin only)
// GET /api/contacts/stats - Get submission stats
router.get('/stats', authMiddleware, getStats);

// GET /api/contacts - List all contacts
router.get('/', authMiddleware, getContacts);

// GET /api/contacts/:id - Get single contact
router.get('/:id', authMiddleware, getContact);

// PATCH /api/contacts/:id - Update contact
router.patch('/:id', authMiddleware, updateContactValidation, validate, updateContact);

// DELETE /api/contacts/:id - Delete contact
router.delete('/:id', authMiddleware, deleteContact);

module.exports = router;
