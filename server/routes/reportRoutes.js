const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    submitReport,
    getMyReports,
    getAllReports
} = require('../controllers/reportController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user._id}_${Date.now()}_${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

router.use(protect);

router.post('/', authorize('manager'), upload.single('reportFile'), submitReport);
router.get('/my', authorize('manager'), getMyReports);
router.get('/all', authorize('admin'), getAllReports);

module.exports = router;
