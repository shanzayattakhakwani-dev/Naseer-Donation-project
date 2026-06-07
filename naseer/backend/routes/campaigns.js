const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const {
  getAllCampaigns, getCampaign, createCampaign, updateCampaign,
  deleteCampaign, addTimelineEvent
} = require('../controllers/campaignController');
const router = express.Router();
router.get('/',    getAllCampaigns);
router.get('/:id', getCampaign);
router.post('/',              protect, restrictTo('admin'), createCampaign);
router.patch('/:id',          protect, restrictTo('admin'), updateCampaign);
router.delete('/:id',         protect, restrictTo('admin'), deleteCampaign);
router.post('/:id/timeline',  protect, restrictTo('admin'), addTimelineEvent);
module.exports = router;
