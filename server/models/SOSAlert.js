const mongoose = require('mongoose');

const sosAlertSchema = new mongoose.Schema({
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker',
        required: true
    },
    location: {
        latitude: Number,
        longitude: Number,
        accuracy: Number
    },
    locationHistory: [{
        latitude: Number,
        longitude: Number,
        accuracy: Number,
        timestamp: { type: Date, default: Date.now }
    }],
    status: {
        type: String,
        enum: ['active', 'resolved'],
        default: 'active'
    },
    district: String,
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker'
    },
    resolvedAt: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('SOSAlert', sosAlertSchema);
