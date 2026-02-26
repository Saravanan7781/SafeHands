const Worker = require('../models/Worker');
const Grievance = require('../models/Grievance');
const Report = require('../models/Report');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// @desc    Get global stats for admin
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
    try {
        const totalWorkers = await Worker.countDocuments({ role: 'worker' });
        const totalManagers = await Worker.countDocuments({ role: 'manager' });
        const totalGrievances = await Grievance.countDocuments();
        const pendingGrievances = await Grievance.countDocuments({ status: 'pending' });
        const totalReports = await Report.countDocuments();

        res.json({
            totalWorkers,
            totalManagers,
            totalGrievances,
            pendingGrievances,
            totalReports
        });
    } catch (error) {
        console.error('Admin Stats Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Register a new manager
// @route   POST /api/admin/register-manager
// @access  Private (Admin)
const registerManager = async (req, res) => {
    try {
        const { fullName, phoneNumber, password, currentDistrict } = req.body;

        if (!fullName || !phoneNumber || !password || !currentDistrict) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const existingUser = await Worker.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(400).json({ message: 'Phone number already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const migrantId = `MGR-${uuidv4()}`;

        const manager = new Worker({
            fullName,
            phoneNumber,
            password: hashedPassword,
            role: 'manager',
            currentDistrict,
            nativeState: 'Department Head', // Default for managers
            migrantId
        });

        await manager.save();
        res.status(201).json({ message: 'Manager registered successfully' });
    } catch (error) {
        console.error('Manager Registration Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all managers
// @route   GET /api/admin/managers
// @access  Private (Admin)
const getAllManagers = async (req, res) => {
    try {
        const managers = await Worker.find({ role: 'manager' }).select('-password');
        res.json(managers);
    } catch (error) {
        console.error('Get Managers Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all reports
// @route   GET /api/admin/reports
// @access  Private (Admin)
const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find().populate('managerId', 'fullName currentDistrict').sort({ submittedAt: -1 });
        res.json(reports);
    } catch (error) {
        console.error('Get Reports Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Verify employment (Global)
// @route   GET /api/admin/pending-verifications
// @access  Private (Admin)
const getGlobalPendingVerifications = async (req, res) => {
    try {
        const workers = await Worker.find({
            'currentEmployment.status': 'pending'
        }).select('fullName phoneNumber currentEmployment currentDistrict nativeState');
        res.json(workers);
    } catch (error) {
        console.error('Global Verifications Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get analytics for a specific district or all districts
// @route   GET /api/admin/district-analytics
// @access  Private (Admin)
const getDistrictAnalytics = async (req, res) => {
    try {
        const { district } = req.query;

        if (district) {
            const workersCount = await Worker.countDocuments({ currentDistrict: district, role: 'worker' });
            const grievancesCount = await Grievance.countDocuments({ district });
            const resolvedCount = await Grievance.countDocuments({ district, status: 'resolved' });
            const pendingCount = await Grievance.countDocuments({ district, status: 'pending' });
            const pendingVerifications = await Worker.countDocuments({ currentDistrict: district, 'currentEmployment.status': 'pending' });

            return res.json({
                district,
                workersCount,
                grievancesCount,
                resolvedCount,
                pendingCount,
                pendingVerifications
            });
        }

        // Return a list of all unique districts with worker counts
        const districts = await Worker.distinct('currentDistrict');
        const summary = await Promise.all(districts.map(async (d) => {
            const count = await Worker.countDocuments({ currentDistrict: d, role: 'worker' });
            return { name: d, workerCount: count };
        }));

        res.json(summary);
    } catch (error) {
        console.error('District Analytics Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAdminStats,
    registerManager,
    getAllManagers,
    getAllReports,
    getGlobalPendingVerifications,
    getDistrictAnalytics
};
