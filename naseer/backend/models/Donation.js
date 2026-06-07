const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const donationSchema = new mongoose.Schema({
  donor:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  donorName:     { type: String, required: true },
  donorEmail:    { type: String, required: true },
  campaign:      { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  amount:        { type: Number, required: true, min: 1 },
  donationType:  { type: String, enum: ['Zakat','Sadaqah','Lillah'], required: true },
  paymentMethod: { type: String, enum: ['EasyPaisa','JazzCash','Bank Transfer','Credit / Debit Card'], required: true },
  receiptId:     { type: String, unique: true },
  transactionId: { type: String, unique: true },
  pdfUrl:        { type: String },
  status:        { type: String, enum: ['pending','confirmed','failed'], default: 'confirmed' },
  isAnonymous:   { type: Boolean, default: false }
}, { timestamps: true });

donationSchema.pre('save', function(next) {
  if (!this.receiptId) {
    const ts  = Date.now().toString(36).toUpperCase();
    const rnd = Math.random().toString(36).substring(2,6).toUpperCase();
    this.receiptId = `NSR-${ts}-${rnd}`;
  }
  if (!this.transactionId) this.transactionId = uuidv4();
  next();
});
module.exports = mongoose.model('Donation', donationSchema);
