const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { registerWorker, getManagerStats, getAllWorkers, getWorkerById, deleteWorker, addEmployment, getPendingEmploymentVerifications, verifyEmployment, verifyAllEmployment, deleteTimelineItem, exportWorkersToExcel } = require('../controllers/workerController');

router.post('/register', registerWorker);
router.get('/', protect, authorize('manager', 'admin'), getAllWorkers);
router.get('/stats', protect, authorize('manager'), getManagerStats);
router.post('/employment', protect, authorize('worker'), addEmployment);
router.get('/pending-verifications', protect, authorize('manager'), getPendingEmploymentVerifications);
router.post('/verify-employment', protect, authorize('manager'), verifyEmployment);
router.post('/verify-all', protect, authorize('manager'), verifyAllEmployment);
router.get('/:id', protect, authorize('manager', 'admin'), getWorkerById);
router.delete('/:id', protect, authorize('manager', 'admin'), deleteWorker);
router.get('/export/workers', protect, authorize('manager'), exportWorkersToExcel);
router.delete('/:workerId/timeline/:timelineId', protect, authorize('manager', 'admin'), deleteTimelineItem);

module.exports = router;
