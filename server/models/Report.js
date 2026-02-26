const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker',
        required: true
    },
    district: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    month: {
        type: String, // e.g. "2026-02"
        required: true
    },
    tasksCompleted: {
        type: Number,
        default: 0
    },
    welfareMetrics: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String // Optional: if they upload a PDF
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Report', reportSchema);
