const Worker = require('../models/Worker');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// @desc    Register a new worker
// @route   POST /api/workers/register
// @access  Public
const registerWorker = async (req, res) => {
    try {
        const {
            fullName,
            age,
            phoneNumber,
            nativeState,
            currentDistrict,
            skills,
            preferredLanguage,
            password
        } = req.body;

        // Basic validation
        if (!fullName || !age || !phoneNumber || !nativeState || !currentDistrict || !skills || !preferredLanguage || !password) {
            return res.status(400).json({ message: 'Please provide all required fields, including password' });
        }

        // Check if worker with same phone number already exists
        const existingWorker = await Worker.findOne({ phoneNumber });
        if (existingWorker) {
            return res.status(400).json({ message: 'The phone number is already registered' });
        }

        // Generate unique Migrant ID
        const migrantId = uuidv4();

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create Worker Profile with Auth details
        const worker = new Worker({
            fullName,
            age,
            phoneNumber,
            password: hashedPassword,
            role: 'worker',
            nativeState,
            currentDistrict,
            skills,
            preferredLanguage,
            migrantId
        });

        const savedWorker = await worker.save();

        res.status(201).json({
            message: 'Registration Successful',
            migrantId: savedWorker.migrantId,
            userId: savedWorker._id
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    registerWorker
};
