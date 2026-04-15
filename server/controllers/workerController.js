const Worker = require('../models/Worker');
const Grievance = require('../models/Grievance');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const XLSX = require('xlsx');

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

// @desc    Get stats for manager's district
// @route   GET /api/workers/stats
// @access  Private (Manager)
const getManagerStats = async (req, res) => {
    try {
        const district = req.user.currentDistrict;

        // 1. Total workers in same district
        const totalWorkers = await Worker.countDocuments({ currentDistrict: district, role: 'worker' });

        // 2. Grievance stats
        const pendingGrievances = await Grievance.countDocuments({ district, status: 'pending' });
        const resolvedGrievances = await Grievance.countDocuments({ district, status: 'completed' });
        const urgentGrievances = await Grievance.countDocuments({ district, status: 'under review' }); // Example mapping

        res.json({
            totalWorkers,
            pendingGrievances,
            resolvedGrievances,
            urgentGrievances
        });
    } catch (error) {
        console.error('Get Stats Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const buildWorkerQuery = (queryParams) => {
    const { state, minAge, maxAge, skills, name, company, currentCompanyOnly } = queryParams;
    let query = { role: 'worker' };

    if (name && name !== '') {
        query.fullName = { $regex: name, $options: 'i' };
    }

    if (state && state !== '') {
        query.nativeState = { $regex: state, $options: 'i' };
    }
    
    if (company && company !== '') {
        if (currentCompanyOnly === 'true') {
            query['currentEmployment.companyName'] = { $regex: company, $options: 'i' };
        } else {
            query.$or = [
                { 'employmentHistory.companyName': { $regex: company, $options: 'i' } },
                { 'currentEmployment.companyName': { $regex: company, $options: 'i' } }
            ];
        }
    }

    if (minAge || maxAge) {
        query.age = {};
        if (minAge && minAge !== '') query.age.$gte = parseInt(minAge);
        if (maxAge && maxAge !== '') query.age.$lte = parseInt(maxAge);
        if (Object.keys(query.age).length === 0) delete query.age;
    }

    if (skills && skills !== '') {
        const skillList = skills.split(',');
        query.skills = { $in: skillList };
    }

    return query;
};

// @desc    Get all workers with filters
// @route   GET /api/workers
// @access  Private (Manager/Admin)
const getAllWorkers = async (req, res) => {
    try {
        const query = buildWorkerQuery(req.query);
        const workers = await Worker.find(query).select('-password');
        res.json(workers);
    } catch (error) {
        console.error('Get All Workers Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get worker by ID
// @route   GET /api/workers/:id
// @access  Private (Manager/Admin)
const getWorkerById = async (req, res) => {
    try {
        const worker = await Worker.findById(req.params.id).select('-password');
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }
        res.json(worker);
    } catch (error) {
        console.error('Get Worker By ID Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete worker
// @route   DELETE /api/workers/:id
// @access  Private (Manager/Admin)
const deleteWorker = async (req, res) => {
    try {
        const worker = await Worker.findById(req.params.id);
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }

        // Use findByIdAndDelete directly or worker.deleteOne()
        await Worker.findByIdAndDelete(req.params.id);

        res.json({ message: 'Worker removed successfully' });
    } catch (error) {
        console.error('Delete Worker Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const addEmployment = async (req, res) => {
    try {
        const { companyName, supervisorNumber, role } = req.body;
        const worker = await Worker.findById(req.user._id);

        if (worker.currentEmployment && worker.currentEmployment.status === 'pending') {
            return res.status(400).json({ message: 'A verification request is already pending.' });
        }

        worker.currentEmployment = {
            companyName,
            supervisorNumber,
            role,
            status: 'pending'
        };

        await worker.save();
        res.json({ message: 'Employment details submitted for verification.', currentEmployment: worker.currentEmployment });
    } catch (error) {
        console.error('Add Employment Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getPendingEmploymentVerifications = async (req, res) => {
    try {
        const district = req.user.currentDistrict;
        const workers = await Worker.find({
            currentDistrict: district,
            'currentEmployment.status': 'pending'
        }).select('fullName phoneNumber currentEmployment nativeState');

        res.json(workers);
    } catch (error) {
        console.error('Get Pending Verifications Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const calculateDuration = (start, end) => {
    const diff = Math.abs(end - start);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;

    let result = '';
    if (months > 0) result += `${months} month${months > 1 ? 's' : ''} `;
    if (remainingDays > 0) result += `${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
    return result.trim() || '1 day';
};

const verifyEmployment = async (req, res) => {
    try {
        const { workerId, action } = req.body; // action: 'verify' or 'reject'
        const worker = await Worker.findById(workerId);

        if (!worker || worker.currentEmployment.status !== 'pending') {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Security Check: Manager can only verify in their district
        if (req.user.role === 'manager' && worker.currentDistrict !== req.user.currentDistrict) {
            return res.status(403).json({ message: 'Unauthorized: Worker is outside your assigned district' });
        }

        if (action === 'verify') {
            // 1. If there's an active employment in history, close it
            const activeIndex = worker.employmentHistory.findIndex(h => h.status === 'verified' && !h.endDate);
            if (activeIndex !== -1) {
                const oldJob = worker.employmentHistory[activeIndex];
                oldJob.endDate = new Date();
                oldJob.duration = calculateDuration(oldJob.startDate, oldJob.endDate);
            }

            // 2. Add current details to history as verified
            worker.employmentHistory.push({
                companyName: worker.currentEmployment.companyName,
                supervisorNumber: worker.currentEmployment.supervisorNumber,
                role: worker.currentEmployment.role,
                startDate: new Date(),
                status: 'verified',
                verifiedAt: new Date(),
                verifiedBy: req.user._id
            });

            // 3. Update current status
            worker.currentEmployment.status = 'active';
        } else {
            worker.currentEmployment.status = 'none'; // Rejected
        }

        await worker.save();
        res.json({ message: `Employment ${action}ed successfully.` });
    } catch (error) {
        console.error('Verify Employment Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const verifyAllEmployment = async (req, res) => {
    try {
        const district = req.user.currentDistrict;
        const workers = await Worker.find({
            currentDistrict: district,
            'currentEmployment.status': 'pending'
        });

        if (workers.length === 0) {
            return res.status(400).json({ message: 'No pending verifications found.' });
        }

        const managerId = req.user._id;

        for (let worker of workers) {
            // Close old active job
            const activeIndex = worker.employmentHistory.findIndex(h => h.status === 'verified' && !h.endDate);
            if (activeIndex !== -1) {
                const oldJob = worker.employmentHistory[activeIndex];
                oldJob.endDate = new Date();
                oldJob.duration = calculateDuration(oldJob.startDate, oldJob.endDate);
            }

            // Add new job to history
            worker.employmentHistory.push({
                companyName: worker.currentEmployment.companyName,
                supervisorNumber: worker.currentEmployment.supervisorNumber,
                role: worker.currentEmployment.role,
                startDate: new Date(),
                status: 'verified',
                verifiedAt: new Date(),
                verifiedBy: managerId
            });

            // Set current as active
            worker.currentEmployment.status = 'active';
            await worker.save();
        }

        res.json({ message: `Successfully approved ${workers.length} employment submissions.` });
    } catch (error) {
        console.error('Bulk Verify Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteTimelineItem = async (req, res) => {
    try {
        const { workerId, timelineId } = req.params;
        const worker = await Worker.findById(workerId);

        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }

        // Security Check: Manager can only modify workers in their district
        if (req.user.role === 'manager' && worker.currentDistrict !== req.user.currentDistrict) {
            return res.status(403).json({ message: 'Unauthorized: Worker is outside your assigned district' });
        }

        // Remove the item from employmentHistory
        worker.employmentHistory = worker.employmentHistory.filter(item => item._id.toString() !== timelineId);

        await worker.save();
        res.json({ message: 'Work history record deleted successfully', employmentHistory: worker.employmentHistory });
    } catch (error) {
        console.error('Delete Timeline Item Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const exportWorkersToExcel = async (req, res) => {
    try {
        const query = buildWorkerQuery(req.query);
        
        // Ensure manager can only export in their district if they are restricted
        if (req.user.role === 'manager') {
            query.currentDistrict = req.user.currentDistrict;
        }

        const workers = await Worker.find(query).select('-password');

        if (!workers || workers.length === 0) {
            return res.status(404).json({ message: 'No workers found for these criteria' });
        }

        const data = workers.map(worker => ({
            'Full Name': worker.fullName,
            'Age': worker.age,
            'Phone Number': worker.phoneNumber,
            'Native State': worker.nativeState,
            'Current District': worker.currentDistrict,
            'Skills': (worker.skills || []).join(', '),
            'Preferred Language': worker.preferredLanguage,
            'Migrant ID': worker.migrantId,
            'Current Company': worker.currentEmployment?.companyName || 'N/A',
            'Current Role': worker.currentEmployment?.role || 'N/A',
            'Current Status': worker.currentEmployment?.status || 'N/A',
            'Work History': (worker.employmentHistory || []).map(h =>
                `${h.companyName} (${h.role}): ${h.status} [${h.startDate ? new Date(h.startDate).toLocaleDateString() : 'N/A'} - ${h.endDate ? new Date(h.endDate).toLocaleDateString() : 'Active'}]`
            ).join('; ')
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Workers');

        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Workers_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
        res.send(buffer);

    } catch (error) {
        console.error('Export Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    registerWorker,
    getManagerStats,
    getAllWorkers,
    getWorkerById,
    deleteWorker,
    addEmployment,
    getPendingEmploymentVerifications,
    verifyEmployment,
    verifyAllEmployment,
    deleteTimelineItem,
    exportWorkersToExcel
};
