const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getAdminStats,
    registerManager,
    getAllManagers,
    getAllReports,
    getGlobalPendingVerifications,
    getDistrictAnalytics
} = require('../controllers/adminController');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.post('/register-manager', registerManager);
router.get('/managers', getAllManagers);
router.get('/reports', getAllReports);
router.get('/pending-verifications', getGlobalPendingVerifications);
router.get('/district-analytics', getDistrictAnalytics);

module.exports = router;
