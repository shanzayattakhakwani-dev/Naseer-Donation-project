let _io = null;

exports.init = (io) => { _io = io; };

exports.emitNewDonation = (donation) => {
  if (!_io) return;
  _io.emit('new-donation', {
    donorName:    donation.isAnonymous ? 'Anonymous' : donation.donorName,
    amount:       donation.amount,
    campaignName: donation.campaign?.title || 'A Campaign',
    
    receiptId:    donation.receiptId,
    timestamp:    new Date()
  });
};

exports.emitMilestone = (campaign, pct) => {
  if (!_io) return;
  _io.emit('campaign-milestone', {
    campaignId:   campaign._id,
    campaignName: campaign.title,
    emoji:        campaign.emoji,
    milestone:    pct,
    raisedAmount: campaign.raisedAmount,
    targetAmount: campaign.targetAmount
  });
};

exports.emitGoalReached = (campaign) => {
  if (!_io) return;
  _io.emit('goal-reached', {
    campaignId:   campaign._id,
    campaignName: campaign.title,
    emoji:        campaign.emoji,
    targetAmount: campaign.targetAmount
  });
};

exports.emitNotification = (userId, notification) => {
  if (!_io) return;
  _io.to(`user:${userId}`).emit('notification', notification);
};
