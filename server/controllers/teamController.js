const Lead = require('../models/Lead');
const User = require('../models/User');

// @desc    Get team performance metrics
// @route   GET /api/team/performance
// @access  Private
exports.getTeamPerformance = async (req, res) => {
  try {
    // Get all users
    const users = await User.find().select('name email role');

    // Get lead counts per user
    const performance = await Lead.aggregate([
      {
        $group: {
          _id: '$assignedTo',
          totalLeads: { $sum: 1 },
          wonLeads: {
            $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] },
          },
          lostLeads: {
            $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] },
          },
          newLeads: {
            $sum: { $cond: [{ $eq: ['$status', 'New'] }, 1, 0] },
          },
          contactedLeads: {
            $sum: { $cond: [{ $eq: ['$status', 'Contacted'] }, 1, 0] },
          },
          qualifiedLeads: {
            $sum: { $cond: [{ $eq: ['$status', 'Qualified'] }, 1, 0] },
          },
          proposalSentLeads: {
            $sum: { $cond: [{ $eq: ['$status', 'Proposal Sent'] }, 1, 0] },
          },
          totalValue: { $sum: '$value' },
          wonValue: {
            $sum: { $cond: [{ $eq: ['$status', 'Won'] }, '$value', 0] },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 1,
          name: '$user.name',
          email: '$user.email',
          role: '$user.role',
          totalLeads: 1,
          wonLeads: 1,
          lostLeads: 1,
          newLeads: 1,
          contactedLeads: 1,
          qualifiedLeads: 1,
          proposalSentLeads: 1,
          totalValue: 1,
          wonValue: 1,
          conversionRate: {
            $cond: [
              { $gt: ['$totalLeads', 0] },
              {
                $multiply: [
                  { $divide: ['$wonLeads', '$totalLeads'] },
                  100,
                ],
              },
              0,
            ],
          },
        },
      },
      { $sort: { wonLeads: -1 } },
    ]);

    res.json({
      teamMembers: performance,
      totalMembers: users.length,
    });
  } catch (error) {
    console.error('GetTeamPerformance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
