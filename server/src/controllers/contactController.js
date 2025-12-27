const Contact = require('../models/Contact');

// Create new contact submission (public)
const createContact = async (req, res) => {
  try {
    const { name, mobileNumber, email, message } = req.body;

    const contact = await Contact.create({
      name,
      mobileNumber,
      email,
      message,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.'
    });

  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form. Please try again.'
    });
  }
};

// Get all contacts with pagination (admin only)
const getContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;

    // Build filter
    const filter = {};
    if (status && ['new', 'read', 'replied', 'archived'].includes(status)) {
      filter.status = status;
    }

    // Calculate skip
    const skip = (page - 1) * limit;

    // Execute query
    const [contacts, total] = await Promise.all([
      Contact.find(filter)
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit)
        .lean(),
      Contact.countDocuments(filter)
    ]);

    // Calculate pagination info
    const pages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: contacts,
      pagination: {
        total,
        page,
        pages,
        limit
      }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts'
    });
  }
};

// Get single contact (admin only)
const getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id).lean();

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: contact
    });

  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact'
    });
  }
};

// Update contact (admin only)
const updateContact = async (req, res) => {
  try {
    const { status, message } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (message) updateData.message = message;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact updated successfully',
      data: contact
    });

  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact'
    });
  }
};

// Delete contact (admin only)
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });

  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact'
    });
  }
};

// Get contact stats (admin only)
const getStats = async (req, res) => {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Contact.countDocuments();

    const statusCounts = {
      new: 0,
      read: 0,
      replied: 0,
      archived: 0
    };

    stats.forEach(stat => {
      statusCounts[stat._id] = stat.count;
    });

    res.json({
      success: true,
      data: {
        total,
        ...statusCounts
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats'
    });
  }
};

module.exports = {
  createContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
  getStats
};
