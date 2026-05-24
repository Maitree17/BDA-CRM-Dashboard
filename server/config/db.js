const mongoose = require('mongoose');

let mongoServer;

const connectDB = async () => {
  try {
    // Production or Atlas URI provided
    if (process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('localhost')) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);

      // Seed if database is empty (first deploy)
      await seedIfEmpty();
      return;
    }

    // Development: fall back to in-memory MongoDB
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      console.log('Starting in-memory MongoDB server...');
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log(`MongoDB In-Memory Connected: ${uri}`);
      await seedIfEmpty();
    } catch (memErr) {
      console.error('No MongoDB URI provided and mongodb-memory-server not available.');
      console.error('Set MONGODB_URI environment variable to connect to a database.');
      process.exit(1);
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const seedIfEmpty = async () => {
  const User = require('../models/User');
  const Lead = require('../models/Lead');

  const existingUsers = await User.countDocuments();
  if (existingUsers > 0) {
    console.log('Database already has data, skipping seed.');
    return;
  }

  console.log('Seeding database with sample data...');

  const users = await User.create([
    { name: 'Admin User', email: 'admin@bdacrm.com', password: 'password123', role: 'admin' },
    { name: 'Rahul Sharma', email: 'rahul@bdacrm.com', password: 'password123', role: 'bda' },
    { name: 'Priya Patel', email: 'priya@bdacrm.com', password: 'password123', role: 'bda' },
    { name: 'Amit Kumar', email: 'amit@bdacrm.com', password: 'password123', role: 'bda' },
    { name: 'Sneha Gupta', email: 'sneha@bdacrm.com', password: 'password123', role: 'manager' },
  ]);

  const now = new Date();
  const leads = [
    { name: 'Vikram Singh', company: 'Tata Motors', email: 'vikram@tatamotors.com', phone: '+91-9876543210', industry: 'Automotive', status: 'Won', assignedTo: users[1]._id, notes: 'Large order for automotive parts.', value: 2500000, createdBy: users[0]._id, createdAt: new Date(now - 86400000 * 2) },
    { name: 'Ananya Reddy', company: 'Bharat Electronics', email: 'ananya@bel.com', phone: '+91-9876543211', industry: 'Electronics', status: 'Proposal Sent', assignedTo: users[2]._id, notes: 'Circuit board manufacturing.', value: 1800000, createdBy: users[0]._id, createdAt: new Date(now - 86400000 * 5) },
    { name: 'Rajesh Mehta', company: 'Larsen & Toubro', email: 'rajesh@lnt.com', phone: '+91-9876543212', industry: 'Construction', status: 'Qualified', assignedTo: users[1]._id, notes: 'Industrial equipment for new plant.', value: 3200000, createdBy: users[0]._id, createdAt: new Date(now - 86400000 * 8) },
    { name: 'Kavitha Nair', company: 'Sun Pharma', email: 'kavitha@sunpharma.com', phone: '+91-9876543213', industry: 'Pharmaceuticals', status: 'New', assignedTo: users[3]._id, notes: 'Pharmaceutical machinery inquiry.', value: 1500000, createdBy: users[0]._id, createdAt: new Date(now - 86400000 * 1) },
    { name: 'Deepak Joshi', company: 'Hindustan Zinc', email: 'deepak@hindzinc.com', phone: '+91-9876543214', industry: 'Metals & Mining', status: 'Contacted', assignedTo: users[2]._id, notes: 'Mining equipment requirements.', value: 4000000, createdBy: users[0]._id, createdAt: new Date(now - 86400000 * 3) },
    { name: 'Meera Krishnan', company: 'Asian Paints', email: 'meera@asianpaints.com', phone: '+91-9876543215', industry: 'Chemical', status: 'Won', assignedTo: users[1]._id, notes: 'Chemical processing equipment.', value: 1900000, createdBy: users[0]._id, createdAt: new Date(now - 86400000 * 12) },
    { name: 'Suresh Iyer', company: 'Mahindra Aerospace', email: 'suresh@mahindra.com', phone: '+91-9876543216', industry: 'Aerospace', status: 'Lost', assignedTo: users[3]._id, notes: 'Lost to competitor.', value: 5000000, createdBy: users[0]._id, createdAt: new Date(now - 86400000 * 15) },
    { name: 'Pooja Desai', company: 'Godrej Industries', email: 'pooja@godrej.com', phone: '+91-9876543217', industry: 'Machinery', status: 'Proposal Sent', assignedTo: users[2]._id, notes: 'Industrial machinery proposal.', value: 2200000, createdBy: users[0]._id, createdAt: new Date(now - 86400000 * 6) },
    { name: 'Arjun Malhotra', company: 'Adani Power', email: 'arjun@adanipower.com', phone: '+91-9876543218', industry: 'Energy', status: 'New', assignedTo: users[1]._id, notes: 'Power generation equipment.', value: 6000000, createdBy: users[0]._id, createdAt: new Date(now - 86400000 * 0) },
    { name: 'Ritu Agarwal', company: 'Nestle India', email: 'ritu@nestle.in', phone: '+91-9876543219', industry: 'Food & Beverage', status: 'Contacted', assignedTo: users[3]._id, notes: 'Food processing line inquiry.', value: 2800000, createdBy: users[0]._id, createdAt: new Date(now - 86400000 * 4) },
    { name: 'Manish Tiwari', company: 'Cipla Ltd', email: 'manish@cipla.com', phone: '+91-9876543220', industry: 'Pharmaceuticals', status: 'Qualified', assignedTo: users[2]._id, notes: 'Quality testing equipment.', value: 1200000, createdBy: users[0]._id, createdAt: new Date(now - 86400000 * 10) },
    { name: 'Nisha Verma', company: 'Bajaj Auto', email: 'nisha@bajaj.com', phone: '+91-9876543221', industry: 'Automotive', status: 'Won', assignedTo: users[3]._id, notes: 'Welding robots for assembly.', value: 3500000, createdBy: users[0]._id, createdAt: new Date(now - 86400000 * 20) },
    { name: 'Karan Kapoor', company: 'Reliance Industries', email: 'karan@reliance.com', phone: '+91-9876543222', industry: 'Chemical', status: 'New', assignedTo: users[1]._id, notes: 'Petrochemical plant equipment.', value: 8000000, createdBy: users[0]._id, createdAt: new Date(now - 86400000 * 1) },
    { name: 'Divya Sharma', company: 'Wipro GE', email: 'divya@wiproge.com', phone: '+91-9876543223', industry: 'Healthcare', status: 'Lost', assignedTo: users[2]._id, notes: 'Medical device manufacturing.', value: 2100000, createdBy: users[0]._id, createdAt: new Date(now - 86400000 * 18) },
    { name: 'Rohit Saxena', company: 'Raymond Ltd', email: 'rohit@raymond.com', phone: '+91-9876543224', industry: 'Textiles', status: 'Contacted', assignedTo: users[1]._id, notes: 'Textile machinery upgrade.', value: 1700000, createdBy: users[0]._id, createdAt: new Date(now - 86400000 * 7) },
    { name: 'Swati Jain', company: 'JSW Steel', email: 'swati@jsw.com', phone: '+91-9876543225', industry: 'Metals & Mining', status: 'Proposal Sent', assignedTo: users[3]._id, notes: 'Steel plant modernization.', value: 7500000, createdBy: users[0]._id, createdAt: new Date(now - 86400000 * 9) },
    { name: 'Vivek Choudhary', company: 'Havells India', email: 'vivek@havells.com', phone: '+91-9876543226', industry: 'Electronics', status: 'Won', assignedTo: users[2]._id, notes: 'PCB manufacturing line.', value: 2400000, createdBy: users[0]._id, createdAt: new Date(now - 86400000 * 25) },
    { name: 'Pallavi Das', company: 'Hindalco', email: 'pallavi@hindalco.com', phone: '+91-9876543227', industry: 'Metals & Mining', status: 'Qualified', assignedTo: users[1]._id, notes: 'Aluminum processing equipment.', value: 3800000, createdBy: users[0]._id, createdAt: new Date(now - 86400000 * 11) },
    { name: 'Aditya Rao', company: 'Plastic Omnium', email: 'aditya@plasticomnium.com', phone: '+91-9876543228', industry: 'Plastics', status: 'New', assignedTo: users[3]._id, notes: 'Injection molding machines.', value: 1600000, createdBy: users[0]._id, createdAt: new Date(now - 86400000 * 2) },
    { name: 'Sanjay Bhat', company: 'BHEL', email: 'sanjay@bhel.com', phone: '+91-9876543229', industry: 'Energy', status: 'Lost', assignedTo: users[2]._id, notes: 'Turbine components.', value: 4500000, createdBy: users[0]._id, createdAt: new Date(now - 86400000 * 22) },
  ];

  await Lead.insertMany(leads);
  console.log(`Seeded: ${users.length} users, ${leads.length} leads`);
  console.log('Login: admin@bdacrm.com / password123');
};

module.exports = connectDB;
