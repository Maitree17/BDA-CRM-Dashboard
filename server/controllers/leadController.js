const { validationResult } = require('express-validator');
const Lead = require('../models/Lead');

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
exports.getLeads = async (req, res) => {
  try {
    const { search, status, assignedTo, page = 1, limit = 50 } = req.query;
    const query = {};

    // Search by name or company
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by assigned user
    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      leads,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('GetLeads error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
exports.getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    console.error('GetLead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create lead
// @route   POST /api/leads
// @access  Private
exports.createLead = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const lead = await Lead.create({
      ...req.body,
      createdBy: req.user._id,
    });

    const populatedLead = await Lead.findById(lead._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');

    res.status(201).json(populatedLead);
  } catch (error) {
    console.error('CreateLead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
exports.updateLead = async (req, res) => {
  try {
    let lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');

    res.json(lead);
  } catch (error) {
    console.error('UpdateLead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lead removed successfully' });
  } catch (error) {
    console.error('DeleteLead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update lead status (for drag-and-drop)
// @route   PATCH /api/leads/:id/status
// @access  Private
exports.updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    console.error('UpdateLeadStatus error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
