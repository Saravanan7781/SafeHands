const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    min: 14 // Assuming minimum working age
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['worker', 'manager', 'admin'],
    default: 'worker'
  },
  nativeState: {
    type: String,
    trim: true
  },
  currentDistrict: {
    type: String,
    required: true,
    trim: true
  },
  skills: {
    type: [String],
  },
  preferredLanguage: {
    type: String,
    trim: true
  },
  migrantId: {
    type: String,
    index: {
      unique: true,
      partialFilterExpression: { migrantId: { $type: "string" } }
    }
  },
  employmentHistory: [{
    companyName: String,
    supervisorNumber: String,
    role: String,
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    duration: String, // Calculated string like "2 months 5 days"
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    verifiedAt: Date,
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' }
  }],
  currentEmployment: {
    companyName: String,
    supervisorNumber: String,
    role: String,
    status: {
      type: String,
      enum: ['none', 'pending', 'active'],
      default: 'none'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Worker', workerSchema);
