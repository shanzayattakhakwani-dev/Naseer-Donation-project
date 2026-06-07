const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
require('dotenv').config();

const User     = require('./models/User');
const Campaign = require('./models/Campaign');
const Donation = require('./models/Donation');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB...');

  // Clear existing data
  await User.deleteMany();
  await Campaign.deleteMany();
  await Donation.deleteMany();
  console.log('Cleared existing data.');

  // Create users
  const admin = await User.create({
    firstName: 'Admin', lastName: 'Naseer', email: 'admin@naseer.pk',
    password: 'admin123', role: 'admin'
  });
  const donor1 = await User.create({
    firstName: 'Maryam', lastName: 'Fraz', email: 'maryam@naseer.pk',
    password: 'donor123', role: 'donor'
  });
  const donor2 = await User.create({
    firstName: 'Shanzay', lastName: 'Atta', email: 'shanzay@naseer.pk',
    password: 'donor123', role: 'donor'
  });
  console.log('✅ Users created');

  // Create campaigns
  const campaigns = await Campaign.insertMany([
    {
      title: 'Emergency Food Aid',
      description: 'Providing emergency food packages to displaced families in Gaza facing acute hunger. Each package feeds a family of 5 for one week.',
      category: 'Sadaqah', emoji: '🍞',
      targetAmount: 500000, raisedAmount: 342000,
      isUrgent: true, isActive: true,
      impactStatement: 'PKR 500 feeds one family for a day.',
      createdBy: admin._id
    },
    {
      title: 'Medical Supplies Fund',
      description: 'Funding critical medicines, surgical equipment, and first-aid supplies for overwhelmed field hospitals in conflict zones.',
      category: 'Zakat', emoji: '🏥',
      targetAmount: 800000, raisedAmount: 610000,
      isUrgent: true, isActive: true,
      impactStatement: 'PKR 2,000 covers medicines for a child for one month.',
      createdBy: admin._id
    },
    {
      title: 'Water & Sanitation',
      description: 'Building clean water access points and sanitation facilities for communities cut off from municipal water supplies.',
      category: 'Lillah', emoji: '💧',
      targetAmount: 300000, raisedAmount: 89000,
      isUrgent: false, isActive: true,
      impactStatement: 'PKR 1,000 provides clean water for a family for a week.',
      createdBy: admin._id
    },
    {
      title: 'Orphan Education',
      description: 'Supporting the education of children orphaned by conflict — covering school fees, books, uniforms, and stationery.',
      category: 'Zakat', emoji: '📚',
      targetAmount: 250000, raisedAmount: 175000,
      isUrgent: false, isActive: true,
      impactStatement: 'PKR 5,000 sponsors a child\'s education for one school term.',
      createdBy: admin._id
    },
    {
      title: 'Winter Relief Kits',
      description: 'Distributing warm clothing, blankets, and essential household supplies to families enduring harsh winter conditions in displacement camps.',
      category: 'Sadaqah', emoji: '🧥',
      targetAmount: 400000, raisedAmount: 220000,
      isUrgent: false, isActive: true,
      impactStatement: 'PKR 3,000 provides a complete winter kit for one family.',
      createdBy: admin._id
    },
    {
      title: 'Rebuild Homes',
      description: 'Reconstruction assistance and building materials for families whose homes were destroyed, helping them rebuild with dignity.',
      category: 'Lillah', emoji: '🏠',
      targetAmount: 1000000, raisedAmount: 450000,
      isUrgent: false, isActive: true,
      impactStatement: 'PKR 10,000 provides essential building materials for one room.',
      createdBy: admin._id
    }
  ]);
  console.log('✅ Campaigns created');

  // Create sample donations
  await Donation.insertMany([
    {
      donor: donor1._id, donorName: 'Maryam Fraz', donorEmail: 'maryam@naseer.pk',
      campaign: campaigns[0]._id, amount: 2000, donationType: 'Sadaqah',
      paymentMethod: 'EasyPaisa', status: 'confirmed'
    },
    {
      donor: donor1._id, donorName: 'Maryam Fraz', donorEmail: 'maryam@naseer.pk',
      campaign: campaigns[1]._id, amount: 5000, donationType: 'Zakat',
      paymentMethod: 'JazzCash', status: 'confirmed'
    },
    {
      donor: donor2._id, donorName: 'Shanzay Atta', donorEmail: 'shanzay@naseer.pk',
      campaign: campaigns[2]._id, amount: 1000, donationType: 'Lillah',
      paymentMethod: 'Bank Transfer', status: 'confirmed'
    },
    {
      donor: donor2._id, donorName: 'Shanzay Atta', donorEmail: 'shanzay@naseer.pk',
      campaign: campaigns[3]._id, amount: 3000, donationType: 'Zakat',
      paymentMethod: 'EasyPaisa', status: 'confirmed'
    }
  ]);

  // Update donor totals
  await User.findByIdAndUpdate(donor1._id, { totalDonated: 7000 });
  await User.findByIdAndUpdate(donor2._id, { totalDonated: 4000 });
  console.log('✅ Donations seeded');

  console.log('\n🎉 Database seeded successfully!\n');
  console.log('Demo Accounts:');
  console.log('  Admin  → admin@naseer.pk  / admin123');
  console.log('  Donor1 → maryam@naseer.pk / donor123');
  console.log('  Donor2 → shanzay@naseer.pk / donor123\n');

  mongoose.disconnect();
};

seed().catch(err => { console.error(err); process.exit(1); });
