const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const { registerNGO, getAllNGOs, getNGO, verifyNGO } = require('../controllers/ngoController');
const router = express.Router();
router.post('/register', protect, registerNGO);
router.get('/', protect, restrictTo('admin'), getAllNGOs);
router.get('/:id', getNGO);
router.patch('/:id/verify', protect, restrictTo('admin'), verifyNGO);
module.exports = router;
