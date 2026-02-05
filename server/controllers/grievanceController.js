const Grievance = require('../models/Grievance');

// @desc    Create a new grievance
// @route   POST /api/grievances
// @access  Private (Worker)
const createGrievance = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: 'Please provide title and description' });
        }

        const grievance = await Grievance.create({
            worker: req.user._id,
            district: req.user.currentDistrict,
            title,
            description
        });

        res.status(201).json(grievance);
    } catch (error) {
        console.error('Create Grievance Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get grievances for a manager's district
// @route   GET /api/grievances/manager
// @access  Private (Manager)
const getGrievancesForManager = async (req, res) => {
    try {
        // Find grievances where the district matches the manager's currentDistrict
        const grievances = await Grievance.find({ district: req.user.currentDistrict })
            .populate('worker', 'fullName phoneNumber')
            .sort('-createdAt');

        res.json(grievances);
    } catch (error) {
        console.error('Get Grievances Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update grievance status
// @route   PUT /api/grievances/:id/status
// @access  Private (Manager)
const updateGrievanceStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'under review', 'completed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const grievance = await Grievance.findById(req.params.id);

        if (!grievance) {
            return res.status(404).json({ message: 'Grievance not found' });
        }

        // Verify manager is in the same district as the grievance
        if (grievance.district !== req.user.currentDistrict) {
            return res.status(403).json({ message: 'Not authorized to update grievances from other districts' });
        }

        grievance.status = status;
        await grievance.save();

        res.json(grievance);
    } catch (error) {
        console.error('Update Grievance Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get grievances for the logged-in worker
// @route   GET /api/grievances/worker
// @access  Private (Worker)
const getWorkerGrievances = async (req, res) => {
    try {
        const grievances = await Grievance.find({ worker: req.user._id })
            .sort('-createdAt');
        res.json(grievances);
    } catch (error) {
        console.error('Get Worker Grievances Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createGrievance,
    getGrievancesForManager,
    updateGrievanceStatus,
    getWorkerGrievances
};
