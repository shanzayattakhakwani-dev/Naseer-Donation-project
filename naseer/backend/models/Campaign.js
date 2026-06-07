const mongoose = require('mongoose');
const campaignSchema = new mongoose.Schema({
  title:           { type: String, required: true, trim: true },
  slug:            { type: String, unique: true },
  description:     { type: String, required: true },
  category:        { type: String, enum: ['Zakat','Sadaqah','Lillah','Emergency'], required: true },
  emoji:           { type: String, default: '🤲' },
  targetAmount:    { type: Number, required: true, min: 1 },
  raisedAmount:    { type: Number, default: 0 },
  isUrgent:        { type: Boolean, default: false },
  isActive:        { type: Boolean, default: true },
  impactStatement: { type: String },
  ngo:             { type: mongoose.Schema.Types.ObjectId, ref: 'NGO' },
  createdBy:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  milestones:      [{ pct: Number, reachedAt: Date }],
  timeline: [{
    title:       { type: String, required: true },
    description: { type: String },
    date:        { type: Date, default: Date.now },
    photoUrl:    { type: String },
    auto:        { type: Boolean, default: false }
  }],
  // Open Graph share image
  ogImage: { type: String },
  // Multilingual
  titleAr:  { type: String },
  titleUr:  { type: String },
  descriptionAr: { type: String },
  descriptionUr: { type: String },
}, { timestamps: true });

campaignSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') + '-' + Date.now().toString(36);
  }
  next();
});

campaignSchema.virtual('progressPercent').get(function() {
  return Math.min(Math.round((this.raisedAmount / this.targetAmount) * 100), 100);
});
campaignSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Campaign', campaignSchema);
