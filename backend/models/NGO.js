const mongoose = require('mongoose');
const ngoSchema = new mongoose.Schema({
  name:               { type: String, required: true, trim: true },
  registrationNumber: { type: String, required: true, unique: true },
  contactEmail:       { type: String, required: true },
  contactPhone:       { type: String },
  description:        { type: String },
  documents: {
    registrationCert: { type: String },
    taxExemptionLetter:{ type: String },
    bankStatement:    { type: String }
  },
  status: { type: String, enum: ['pending','documents-reviewed','approved','rejected'], default: 'pending' },
  verificationTimeline: [{
    stage:     { type: String },
    note:      { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
  adminNote:   { type: String },
  verifiedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
module.exports = mongoose.model('NGO', ngoSchema);
