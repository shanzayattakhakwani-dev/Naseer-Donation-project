const mongoose = require('mongoose');
const volunteerSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  skills:       [{ type: String, enum: ['medical','logistics','translation','fundraising','tech','education','other'] }],
  availability: { type: String, enum: ['weekdays','weekends','both'], default: 'both' },
  city:         { type: String, required: true },
  status:       { type: String, enum: ['pending','active','inactive'], default: 'pending' },
  hoursLogged:  { type: Number, default: 0 },
  badges:       [{ type: String }],
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
module.exports = mongoose.model('Volunteer', volunteerSchema);
