const Worker = require('../models/Worker');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;

        // Validation
        if (!phoneNumber || !password) {
            return res.status(400).json({ message: 'Please provide phone number and password' });
        }

        // Check for worker
        const worker = await Worker.findOne({ phoneNumber });
        if (!worker) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, worker.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT Token
        const token = jwt.sign(
            { id: worker._id, role: worker.role, phoneNumber: worker.phoneNumber },
            process.env.JWT_SECRET || 'secret123', // Fallback for dev if env not set
            { expiresIn: '30d' }
        );

        res.json({
            token,
            user: {
                id: worker._id,
                phoneNumber: worker.phoneNumber,
                role: worker.role,
                fullName: worker.fullName,
                age: worker.age,
                nativeState: worker.nativeState,
                currentDistrict: worker.currentDistrict,
                skills: worker.skills,
                preferredLanguage: worker.preferredLanguage,
                migrantId: worker.migrantId
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    loginUser
};
