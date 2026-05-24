const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Lead = require('./models/Lead');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Lead.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const users = await User.create([
      { name: 'Admin User', email: 'admin@bdacrm.com', password: 'password123', role: 'admin' },
      { name: 'Rahul Sharma', email: 'rahul@bdacrm.com', password: 'password123', role: 'bda' },
      { name: 'Priya Patel', email: 'priya@bdacrm.com', password: 'password123', role: 'bda' },
      { name: 'Amit Kumar', email: 'amit@bdacrm.com', password: 'password123', role: 'bda' },
      { name: 'Sneha Gupta', email: 'sneha@bdacrm.com', password: 'password123', role: 'manager' },
    ]);

    console.log('Created users:', users.map(u => u.name));

    // Create leads
    const leads = [
      { name: 'Vikram Singh', company: 'Tata Motors', email: 'vikram@tatamotors.com', phone: '+91-9876543210', industry: 'Automotive', status: 'Won', assignedTo: users[1]._id, notes: 'Large order for automotive parts. Closed successfully.', value: 2500000, createdBy: users[0]._id },
      { name: 'Ananya Reddy', company: 'Bharat Electronics', email: 'ananya@bel.com', phone: '+91-9876543211', industry: 'Electronics', status: 'Proposal Sent', assignedTo: users[2]._id, notes: 'Interested in circuit board manufacturing.', value: 1800000, createdBy: users[0]._id },
      { name: 'Rajesh Mehta', company: 'Larsen & Toubro', email: 'rajesh@lnt.com', phone: '+91-9876543212', industry: 'Construction', status: 'Qualified', assignedTo: users[1]._id, notes: 'Needs industrial equipment for new plant.', value: 3200000, createdBy: users[0]._id },
      { name: 'Kavitha Nair', company: 'Sun Pharma', email: 'kavitha@sunpharma.com', phone: '+91-9876543213', industry: 'Pharmaceuticals', status: 'New', assignedTo: users[3]._id, notes: 'Inquiry about pharmaceutical machinery.', value: 1500000, createdBy: users[0]._id },
      { name: 'Deepak Joshi', company: 'Hindustan Zinc', email: 'deepak@hindzinc.com', phone: '+91-9876543214', industry: 'Metals & Mining', status: 'Contacted', assignedTo: users[2]._id, notes: 'Discussed mining equipment requirements.', value: 4000000, createdBy: users[0]._id },
      { name: 'Meera Krishnan', company: 'Asian Paints', email: 'meera@asianpaints.com', phone: '+91-9876543215', industry: 'Chemical', status: 'Won', assignedTo: users[1]._id, notes: 'Chemical processing equipment. Deal won!', value: 1900000, createdBy: users[0]._id },
      { name: 'Suresh Iyer', company: 'Mahindra Aerospace', email: 'suresh@mahindra.com', phone: '+91-9876543216', industry: 'Aerospace', status: 'Lost', assignedTo: users[3]._id, notes: 'Lost to competitor. Price was too high.', value: 5000000, createdBy: users[0]._id },
      { name: 'Pooja Desai', company: 'Godrej Industries', email: 'pooja@godrej.com', phone: '+91-9876543217', industry: 'Machinery', status: 'Proposal Sent', assignedTo: users[2]._id, notes: 'Sent proposal for industrial machinery.', value: 2200000, createdBy: users[0]._id },
      { name: 'Arjun Malhotra', company: 'Adani Power', email: 'arjun@adanipower.com', phone: '+91-9876543218', industry: 'Energy', status: 'New', assignedTo: users[1]._id, notes: 'Needs power generation equipment.', value: 6000000, createdBy: users[0]._id },
      { name: 'Ritu Agarwal', company: 'Nestle India', email: 'ritu@nestle.in', phone: '+91-9876543219', industry: 'Food & Beverage', status: 'Contacted', assignedTo: users[3]._id, notes: 'Food processing line inquiry.', value: 2800000, createdBy: users[0]._id },
      { name: 'Manish Tiwari', company: 'Cipla Ltd', email: 'manish@cipla.com', phone: '+91-9876543220', industry: 'Pharmaceuticals', status: 'Qualified', assignedTo: users[2]._id, notes: 'Quality testing equipment needed.', value: 1200000, createdBy: users[0]._id },
      { name: 'Nisha Verma', company: 'Bajaj Auto', email: 'nisha@bajaj.com', phone: '+91-9876543221', industry: 'Automotive', status: 'Won', assignedTo: users[3]._id, notes: 'Welding robots for assembly line.', value: 3500000, createdBy: users[0]._id },
      { name: 'Karan Kapoor', company: 'Reliance Industries', email: 'karan@reliance.com', phone: '+91-9876543222', industry: 'Chemical', status: 'New', assignedTo: users[1]._id, notes: 'Petrochemical plant equipment.', value: 8000000, createdBy: users[0]._id },
      { name: 'Divya Sharma', company: 'Wipro GE', email: 'divya@wiproge.com', phone: '+91-9876543223', industry: 'Healthcare', status: 'Lost', assignedTo: users[2]._id, notes: 'Medical device manufacturing. Lost deal.', value: 2100000, createdBy: users[0]._id },
      { name: 'Rohit Saxena', company: 'Raymond Ltd', email: 'rohit@raymond.com', phone: '+91-9876543224', industry: 'Textiles', status: 'Contacted', assignedTo: users[1]._id, notes: 'Textile machinery upgrade project.', value: 1700000, createdBy: users[0]._id },
      { name: 'Swati Jain', company: 'JSW Steel', email: 'swati@jsw.com', phone: '+91-9876543225', industry: 'Metals & Mining', status: 'Proposal Sent', assignedTo: users[3]._id, notes: 'Steel plant modernization.', value: 7500000, createdBy: users[0]._id },
      { name: 'Vivek Choudhary', company: 'Havells India', email: 'vivek@havells.com', phone: '+91-9876543226', industry: 'Electronics', status: 'Won', assignedTo: users[2]._id, notes: 'PCB manufacturing line. Won the deal!', value: 2400000, createdBy: users[0]._id },
      { name: 'Pallavi Das', company: 'Hindalco', email: 'pallavi@hindalco.com', phone: '+91-9876543227', industry: 'Metals & Mining', status: 'Qualified', assignedTo: users[1]._id, notes: 'Aluminum processing equipment.', value: 3800000, createdBy: users[0]._id },
      { name: 'Aditya Rao', company: 'Plastic Omnium', email: 'aditya@plasticomnium.com', phone: '+91-9876543228', industry: 'Plastics', status: 'New', assignedTo: users[3]._id, notes: 'Injection molding machines.', value: 1600000, createdBy: users[0]._id },
      { name: 'Sanjay Bhat', company: 'BHEL', email: 'sanjay@bhel.com', phone: '+91-9876543229', industry: 'Energy', status: 'Lost', assignedTo: users[2]._id, notes: 'Turbine components. Budget constraints.', value: 4500000, createdBy: users[0]._id },
    ];

    await Lead.create(leads);
    console.log(`Created ${leads.length} leads`);

    console.log('\n--- Seed Complete ---');
    console.log('Login credentials:');
    console.log('  Admin: admin@bdacrm.com / password123');
    console.log('  BDA:   rahul@bdacrm.com / password123');
    console.log('  BDA:   priya@bdacrm.com / password123');
    console.log('  BDA:   amit@bdacrm.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
