const express = require('express');
const router = express.Router();
const { createGrievance, getGrievancesForManager, updateGrievanceStatus, getWorkerGrievances } = require('../controllers/grievanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('worker'), createGrievance);
router.get('/worker', protect, authorize('worker'), getWorkerGrievances);
router.get('/manager', protect, authorize('manager'), getGrievancesForManager);
router.put('/:id/status', protect, authorize('manager'), updateGrievanceStatus);

module.exports = router;
