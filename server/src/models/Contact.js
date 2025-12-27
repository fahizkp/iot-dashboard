const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
      validate: {
        validator: function(v) {
          return /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number`
      }
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function(v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: props => `${props.value} is not a valid email address`
      }
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [2000, 'Message cannot exceed 2000 characters']
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'archived'],
      default: 'new'
    },
    ipAddress: {
      type: String,
      default: null
    },
    userAgent: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Indexes for better query performance
contactSchema.index({ createdAt: -1 });
contactSchema.index({ status: 1 });
contactSchema.index({ email: 1 });

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
