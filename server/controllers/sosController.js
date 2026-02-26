const SOSAlert = require('../models/SOSAlert');
const Worker = require('../models/Worker');

// @desc    Trigger SOS alert
// @route   POST /api/sos/trigger
// @access  Private (Worker)
const triggerSOS = async (req, res) => {
    try {
        const { location } = req.body;
        const workerId = req.user._id;
        const district = req.user.currentDistrict;

        const newSOS = new SOSAlert({
            workerId,
            location,
            district
        });

        await newSOS.save();

        res.status(201).json({
            message: 'SOS Alert triggered successfully. Emergency services and managers have been notified.',
            alertId: newSOS._id
        });
    } catch (error) {
        console.error('SOS Trigger Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get active SOS alerts for manager's district
// @route   GET /api/sos/alerts
// @access  Private (Manager)
const getSOSAlerts = async (req, res) => {
    try {
        const district = req.user.currentDistrict;
        const alerts = await SOSAlert.find({ district, status: 'active' })
            .populate('workerId', 'fullName phoneNumber nativeState')
            .sort({ createdAt: -1 });

        res.json(alerts);
    } catch (error) {
        console.error('Get SOS Alerts Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Resolve SOS alert
// @route   PATCH /api/sos/resolve/:id
// @access  Private (Manager)
const resolveSOS = async (req, res) => {
    try {
        const alert = await SOSAlert.findById(req.params.id);
        if (!alert) {
            return res.status(404).json({ message: 'Alert not found' });
        }

        // Verify manager is in the same district as the alert
        if (alert.district !== req.user.currentDistrict) {
            return res.status(403).json({ message: 'Not authorized to resolve SOS alerts from other districts' });
        }

        alert.status = 'resolved';
        alert.resolvedBy = req.user._id;
        alert.resolvedAt = Date.now();

        await alert.save();

        res.json({ message: 'SOS Alert marked as resolved' });
    } catch (error) {
        console.error('Resolve SOS Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update SOS location (live tracking)
// @route   PATCH /api/sos/update-location/:id
// @access  Private (Worker)
const updateSOSLocation = async (req, res) => {
    try {
        const { location } = req.body;
        const alert = await SOSAlert.findById(req.params.id);

        if (!alert) {
            return res.status(404).json({ message: 'Alert not found' });
        }

        if (alert.status === 'resolved') {
            return res.status(400).json({ message: 'Alert already resolved' });
        }

        alert.location = location;
        alert.locationHistory.push(location);
        await alert.save();

        res.json({ message: 'Location updated' });
    } catch (error) {
        console.error('Update SOS Location Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    triggerSOS,
    getSOSAlerts,
    resolveSOS,
    updateSOSLocation
};
