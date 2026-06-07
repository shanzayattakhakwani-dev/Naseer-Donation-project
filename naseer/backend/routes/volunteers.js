const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const { register, getAll, approve, downloadCert } = require('../controllers/volunteerController');
const router = express.Router();
router.post('/', protect, register);
router.get('/', protect, restrictTo('admin'), getAll);
router.patch('/:id/approve', protect, restrictTo('admin'), approve);
router.get('/certificate/:id', protect, downloadCert);
module.exports = router;
