const Donation      = require('../models/Donation');
const Campaign      = require('../models/Campaign');
const User          = require('../models/User');
const Notification  = require('../models/Notification');
const socketUtil    = require('../utils/socket');
const { sendDonationEmail }  = require('../utils/email');
const { generateDonationPDF } = require('../utils/pdfGenerator');

exports.createDonation = async (req, res) => {
  try {
    const { campaignId, amount, donationType, paymentMethod, donorName, donorEmail, isAnonymous } = req.body;
    if (!campaignId||!amount||!donationType||!paymentMethod||!donorName||!donorEmail)
      return res.status(400).json({ success:false, message:'All fields are required.' });
    if (Number(amount)<=0)
      return res.status(400).json({ success:false, message:'Amount must be greater than zero.' });

    const campaign = await Campaign.findById(campaignId);
    if (!campaign||!campaign.isActive) return res.status(404).json({ success:false, message:'Campaign not found.' });

    const donation = await Donation.create({
      donor: req.user?._id||null,
      donorName: isAnonymous?'Anonymous':donorName,
      donorEmail, campaign:campaignId,
      amount:Number(amount), donationType, paymentMethod,
      isAnonymous:Boolean(isAnonymous), status:'confirmed'
    });

    const prevPct = Math.floor((campaign.raisedAmount/campaign.targetAmount)*100);
    campaign.raisedAmount += Number(amount);
    const newPct  = Math.floor((campaign.raisedAmount/campaign.targetAmount)*100);

    for (const m of [50,75,100]) {
      if (prevPct < m && newPct >= m) {
        campaign.milestones = campaign.milestones||[];
        campaign.milestones.push({ pct:m, reachedAt:new Date() });
        campaign.timeline = campaign.timeline||[];
        campaign.timeline.push({ title:`${m}% Funded!`, description:`Campaign reached ${m}% of its goal.`, auto:true });
        socketUtil.emitMilestone(campaign, m);
        if (m===100) {
          socketUtil.emitGoalReached(campaign);
          const donors = await Donation.find({ campaign:campaignId, donor:{$ne:null} }).distinct('donor');
          for (const uid of donors) {
            await Notification.create({ userId:uid, type:'goal-reached', message:`🎉 ${campaign.title} has been fully funded!`, link:`/campaigns/${campaign.slug}` });
          }
        }
      }
    }
    await campaign.save();
    if (req.user) await User.findByIdAndUpdate(req.user._id, { $inc:{ totalDonated:Number(amount) } });
    await donation.populate('campaign','title category emoji slug');
    socketUtil.emitNewDonation(donation);

    if (req.user) {
      const notif = await Notification.create({
        userId:req.user._id, type:'donation-confirmed',
        message:`Donation of PKR ${Number(amount).toLocaleString()} to ${campaign.title} confirmed!`,
        link:'/dashboard', meta:{ receiptId:donation.receiptId }
      });
      socketUtil.emitNotification(req.user._id, notif);
    }

    // PDF + email in background
    generateDonationPDF({
      donorName:donation.donorName, amount:donation.amount, campaign:campaign.title,
      receiptId:donation.receiptId, transactionId:donation.transactionId,
      donationType, date:new Date().toLocaleDateString('en-PK',{day:'numeric',month:'long',year:'numeric'})
    }).then(buf => {
      sendDonationEmail({ to:donorEmail, donorName:donation.donorName, amount:donation.amount,
        campaign:campaign.title, receiptId:donation.receiptId, transactionId:donation.transactionId });
    }).catch(e => console.warn('PDF/email error:',e.message));

    res.status(201).json({ success:true, data:donation });
  } catch(err){ res.status(500).json({ success:false, message:err.message }); }
};

exports.getMyDonations = async (req,res) => {
  try {
    const d = await Donation.find({ donor:req.user._id }).populate('campaign','title category emoji slug').sort({ createdAt:-1 });
    res.json({ success:true, count:d.length, data:d });
  } catch(e){ res.status(500).json({ success:false, message:e.message }); }
};

exports.getAllDonations = async (req,res) => {
  try {
    const d = await Donation.find().populate('campaign','title category').populate('donor','firstName lastName email').sort({ createdAt:-1 });
    res.json({ success:true, count:d.length, data:d });
  } catch(e){ res.status(500).json({ success:false, message:e.message }); }
};

exports.getDonationStats = async (req,res) => {
  try {
    const [overview] = await Donation.aggregate([{ $match:{ status:'confirmed' } },{ $group:{ _id:null, totalAmount:{ $sum:'$amount' }, count:{ $count:{} }, avg:{ $avg:'$amount' } } }]);
    const byType = await Donation.aggregate([{ $group:{ _id:'$donationType', total:{ $sum:'$amount' }, count:{ $count:{} } } }]);
    res.json({ success:true, data:{ overview:overview||{}, byType } });
  } catch(e){ res.status(500).json({ success:false, message:e.message }); }
};

exports.downloadPDF = async (req,res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate('campaign','title');
    if (!donation) return res.status(404).json({ success:false, message:'Not found.' });
    const buf = await generateDonationPDF({
      donorName:donation.donorName, amount:donation.amount, campaign:donation.campaign?.title||'Campaign',
      receiptId:donation.receiptId, transactionId:donation.transactionId, donationType:donation.donationType,
      date:new Date(donation.createdAt).toLocaleDateString('en-PK',{day:'numeric',month:'long',year:'numeric'})
    });
    res.setHeader('Content-Type','application/pdf');
    res.setHeader('Content-Disposition',`attachment; filename="${donation.receiptId}.pdf"`);
    res.send(buf);
  } catch(e){ res.status(500).json({ success:false, message:e.message }); }
};
