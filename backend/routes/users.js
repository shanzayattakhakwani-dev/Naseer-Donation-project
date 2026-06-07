const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const { getAllUsers, toggleUser } = require('../controllers/userController');
const router = express.Router();
router.get('/',           protect, restrictTo('admin'), getAllUsers);
router.patch('/:id/toggle', protect, restrictTo('admin'), toggleUser);
module.exports = router;
