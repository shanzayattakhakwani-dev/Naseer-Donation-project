const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN||'7d' });

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName?.trim()) return res.status(400).json({ success:false, message:'First name is required.' });
    if (!lastName?.trim())  return res.status(400).json({ success:false, message:'Last name is required.' });
    if (!email?.includes('@')) return res.status(400).json({ success:false, message:'Valid email is required.' });
    if (!password||password.length<8) return res.status(400).json({ success:false, message:'Password must be at least 8 characters.' });
    if (await User.findOne({ email:email.toLowerCase() })) return res.status(409).json({ success:false, message:'Email already registered.' });
    const user  = await User.create({ firstName:firstName.trim(), lastName:lastName.trim(), email:email.toLowerCase(), password });
    const token = signToken(user._id);
    res.status(201).json({ success:true, token, user:{ id:user._id, firstName:user.firstName, lastName:user.lastName, email:user.email, role:user.role, totalDonated:0 } });
  } catch(err){ res.status(500).json({ success:false, message:err.message }); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email||!password) return res.status(400).json({ success:false, message:'Email and password are required.' });
    const user = await User.findOne({ email:email.toLowerCase() }).select('+password');
    if (!user||!(await user.comparePassword(password))) return res.status(401).json({ success:false, message:'Invalid email or password.' });
    if (!user.isActive) return res.status(403).json({ success:false, message:'Account deactivated. Contact support.' });
    const token = signToken(user._id);
    res.json({ success:true, token, user:{ id:user._id, firstName:user.firstName, lastName:user.lastName, email:user.email, role:user.role, totalDonated:user.totalDonated } });
  } catch(err){ res.status(500).json({ success:false, message:err.message }); }
};

exports.getMe = async (req, res) => res.json({ success:true, user:req.user });
