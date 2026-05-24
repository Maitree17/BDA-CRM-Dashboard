const Lead = require('../models/Lead');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'New' });
    const contactedLeads = await Lead.countDocuments({ status: 'Contacted' });
    const qualifiedLeads = await Lead.countDocuments({ status: 'Qualified' });
    const proposalSent = await Lead.countDocuments({ status: 'Proposal Sent' });
    const wonDeals = await Lead.countDocuments({ status: 'Won' });
    const lostDeals = await Lead.countDocuments({ status: 'Lost' });

    // Total value of won deals
    const wonValue = await Lead.aggregate([
      { $match: { status: 'Won' } },
      { $group: { _id: null, total: { $sum: '$value' } } },
    ]);

    // Pipeline value (all active deals)
    const pipelineValue = await Lead.aggregate([
      { $match: { status: { $nin: ['Won', 'Lost'] } } },
      { $group: { _id: null, total: { $sum: '$value' } } },
    ]);

    // Recent leads (last 10)
    const recentLeads = await Lead.find()
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Leads by industry
    const leadsByIndustry = await Lead.aggregate([
      { $group: { _id: '$industry', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Leads by status for chart
    const leadsByStatus = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Monthly leads (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyLeads = await Lead.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
      totalLeads,
      newLeads,
      contactedLeads,
      qualifiedLeads,
      proposalSent,
      wonDeals,
      lostDeals,
      wonValue: wonValue[0]?.total || 0,
      pipelineValue: pipelineValue[0]?.total || 0,
      recentLeads,
      leadsByIndustry,
      leadsByStatus,
      monthlyLeads,
    });
  } catch (error) {
    console.error('GetStats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
