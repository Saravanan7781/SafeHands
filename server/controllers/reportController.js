const Report = require('../models/Report');

// @desc    Submit a monthly performance report
// @route   POST /api/reports
// @access  Private (Manager)
const submitReport = async (req, res) => {
    try {
        const { title, month, tasksCompleted, welfareMetrics } = req.body;
        const managerId = req.user._id;
        const district = req.user.currentDistrict;
        const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

        if (!title || !month || !welfareMetrics) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const report = new Report({
            managerId,
            district,
            title,
            month,
            tasksCompleted: tasksCompleted || 0,
            welfareMetrics,
            fileUrl
        });

        await report.save();
        res.status(201).json({ message: 'Performance report submitted successfully' });
    } catch (error) {
        console.error('Submit Report Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get reports submitted by current manager
// @route   GET /api/reports/my
// @access  Private (Manager)
const getMyReports = async (req, res) => {
    try {
        const reports = await Report.find({ managerId: req.user._id }).sort({ submittedAt: -1 });
        res.json(reports);
    } catch (error) {
        console.error('Get My Reports Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find()
            .populate('managerId', 'fullName currentDistrict')
            .sort({ submittedAt: -1 });
        res.json(reports);
    } catch (error) {
        console.error('Get All Reports Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    submitReport,
    getMyReports,
    getAllReports
};
