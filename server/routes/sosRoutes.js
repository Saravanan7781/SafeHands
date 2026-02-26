const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { triggerSOS, getSOSAlerts, resolveSOS, updateSOSLocation } = require('../controllers/sosController');

router.post('/trigger', protect, authorize('worker'), triggerSOS);
router.get('/alerts', protect, authorize('manager', 'admin'), getSOSAlerts);
router.patch('/resolve/:id', protect, authorize('manager', 'admin'), resolveSOS);
router.patch('/update-location/:id', protect, authorize('worker'), updateSOSLocation);

module.exports = router;
