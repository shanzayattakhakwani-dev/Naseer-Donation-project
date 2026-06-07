const Volunteer    = require('../models/Volunteer');
const Notification = require('../models/Notification');
const socketUtil   = require('../utils/socket');
const { sendVolunteerApproval } = require('../utils/email');
const { generateVolunteerCertPDF } = require('../utils/pdfGenerator');

// POST /api/volunteers
exports.register = async (req, res) => {
  try {
    const { name, email, skills, availability, city } = req.body;
    if (!name || !email || !city) return res.status(400).json({ success: false, message: 'Name, email and city are required.' });
    const existing = await Volunteer.findOne({ email });
    if (existing) return res.status(409).json({ success: false, message: 'Email already registered as volunteer.' });
    const volunteer = await Volunteer.create({ name, email, skills: skills||[], availability, city, userId: req.user?._id });
    res.status(201).json({ success: true, data: volunteer, message: 'Application submitted! Pending admin review.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/volunteers (admin)
exports.getAll = async (req, res) => {
  try {
    const { status } = req.query;
    const volunteers = await Volunteer.find(status ? { status } : {}).sort({ createdAt: -1 });
    res.json({ success: true, count: volunteers.length, data: volunteers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/volunteers/:id/approve (admin)
exports.approve = async (req, res) => {
  try {
    const v = await Volunteer.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true });
    if (!v) return res.status(404).json({ success: false, message: 'Volunteer not found.' });
    await sendVolunteerApproval({ to: v.email, name: v.name });
    if (v.userId) {
      const notif = await Notification.create({ userId: v.userId, type: 'admin-approval', message: `Your volunteer application has been approved! Welcome to the NASEER team.`, link: '/dashboard' });
      socketUtil.emitNotification(v.userId, notif);
    }
    res.json({ success: true, data: v, message: 'Volunteer approved.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/volunteers/certificate/:id  — PDF cert download
exports.downloadCert = async (req, res) => {
  try {
    const v = await Volunteer.findById(req.params.id);
    if (!v || v.status !== 'active') return res.status(404).json({ success: false, message: 'Active volunteer not found.' });
    const buf = await generateVolunteerCertPDF({ name: v.name, skills: v.skills, city: v.city, hoursLogged: v.hoursLogged, date: new Date().toLocaleDateString() });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="NASEER-Volunteer-${v.name.replace(/\s/g,'-')}.pdf"`);
    res.send(buf);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
