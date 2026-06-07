const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:      { type: String, enum: ['donation-confirmed','milestone-reached','emergency-alert','admin-approval','receipt-ready','campaign-recommended','goal-reached'], required: true },
  message:   { type: String, required: true },
  link:      { type: String },
  read:      { type: Boolean, default: false },
  meta:      { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });
module.exports = mongoose.model('Notification', notificationSchema);
