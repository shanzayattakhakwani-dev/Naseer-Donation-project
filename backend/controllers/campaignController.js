const Campaign = require('../models/Campaign');

// GET /api/campaigns
exports.getAllCampaigns = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.urgent === 'true') filter.isUrgent = true;
    const campaigns = await Campaign.find(filter).sort({ isUrgent: -1, createdAt: -1 });
    res.json({ success: true, count: campaigns.length, data: campaigns });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/campaigns/:id
exports.getCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found.' });
    res.json({ success: true, data: campaign });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/campaigns
exports.createCampaign = async (req, res) => {
  try {
    const { title, description, category, emoji, targetAmount, isUrgent, impactStatement } = req.body;
    if (!title || !description || !category || !targetAmount) {
      return res.status(400).json({ success: false, message: 'title, description, category and targetAmount are required.' });
    }
    const campaign = await Campaign.create({
      title, description, category, emoji, targetAmount, isUrgent, impactStatement,
      createdBy: req.user._id
    });
    res.status(201).json({ success: true, data: campaign });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/campaigns/:id
exports.updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found.' });
    res.json({ success: true, data: campaign });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/campaigns/:id
exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found.' });
    res.json({ success: true, message: 'Campaign deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/campaigns/:id/timeline  (Admin)
exports.addTimelineEvent = async (req, res) => {
  try {
    const { title, description, date, photoUrl } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title is required.' });
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { $push: { timeline: { title, description, date: date || new Date(), photoUrl, auto: false } } },
      { new: true }
    );
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found.' });
    res.json({ success: true, data: campaign.timeline });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
