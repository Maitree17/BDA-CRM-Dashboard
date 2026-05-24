const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a lead name'],
    trim: true,
    maxlength: 100,
  },
  company: {
    type: String,
    required: [true, 'Please provide a company name'],
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    maxlength: 20,
  },
  industry: {
    type: String,
    required: [true, 'Please provide an industry'],
    enum: [
      'Automotive',
      'Aerospace',
      'Chemical',
      'Construction',
      'Electronics',
      'Energy',
      'Food & Beverage',
      'Healthcare',
      'Machinery',
      'Metals & Mining',
      'Pharmaceuticals',
      'Plastics',
      'Textiles',
      'Other',
    ],
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'],
    default: 'New',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please assign the lead to a user'],
  },
  notes: {
    type: String,
    maxlength: 1000,
    default: '',
  },
  value: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Index for search functionality
leadSchema.index({ name: 'text', company: 'text' });

module.exports = mongoose.model('Lead', leadSchema);
