const NGO          = require('../models/NGO');
const Notification = require('../models/Notification');
const socketUtil   = require('../utils/socket');

// POST /api/ngos/register
exports.registerNGO = async (req, res) => {
  try {
    const { name, registrationNumber, contactEmail, contactPhone, description } = req.body;
    if (!name || !registrationNumber || !contactEmail)
      return res.status(400).json({ success: false, message: 'Name, registration number and email are required.' });

    const existing = await NGO.findOne({ registrationNumber });
    if (existing) return res.status(409).json({ success: false, message: 'NGO with this registration number already exists.' });

    // Handle uploaded document URLs from Cloudinary (via multer-cloudinary middleware)
    const documents = {
      registrationCert:    req.files?.registrationCert?.[0]?.path || null,
      taxExemptionLetter:  req.files?.taxExemptionLetter?.[0]?.path || null,
      bankStatement:       req.files?.bankStatement?.[0]?.path || null,
    };

    const ngo = await NGO.create({
      name, registrationNumber, contactEmail, contactPhone, description,
      documents,
      submittedBy: req.user?._id,
      verificationTimeline: [{ stage: 'submitted', note: 'NGO registration submitted and awaiting review.' }]
    });

    res.status(201).json({ success: true, data: ngo, message: 'NGO registered. Pending admin review.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/ngos
exports.getAllNGOs = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const ngos = await NGO.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: ngos.length, data: ngos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/ngos/:id
exports.getNGO = async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id);
    if (!ngo) return res.status(404).json({ success: false, message: 'NGO not found.' });
    res.json({ success: true, data: ngo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/ngos/:id/verify  (Admin)
exports.verifyNGO = async (req, res) => {
  try {
    const { action, note } = req.body; // action: 'approve' | 'reject' | 'review'
    const ngo = await NGO.findById(req.params.id);
    if (!ngo) return res.status(404).json({ success: false, message: 'NGO not found.' });

    const statusMap = { approve: 'approved', reject: 'rejected', review: 'documents-reviewed' };
    const newStatus = statusMap[action];
    if (!newStatus) return res.status(400).json({ success: false, message: 'Invalid action. Use approve, reject, or review.' });

    ngo.status     = newStatus;
    ngo.adminNote  = note || '';
    ngo.verifiedBy = req.user._id;
    ngo.verificationTimeline.push({ stage: newStatus, note: note || `Status updated to ${newStatus}` });
    await ngo.save();

    // Notify NGO submitter
    if (ngo.submittedBy) {
      const notif = await Notification.create({
        userId:  ngo.submittedBy,
        type:    'admin-approval',
        message: `Your NGO "${ngo.name}" has been ${newStatus}. ${note || ''}`,
        link:    '/dashboard'
      });
      socketUtil.emitNotification(ngo.submittedBy, notif);
    }

    res.json({ success: true, data: ngo, message: `NGO ${newStatus} successfully.` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
