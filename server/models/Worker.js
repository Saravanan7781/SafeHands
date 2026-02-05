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
    unique: true,
    sparse: true
  },

}, {
  timestamps: true
});

module.exports = mongoose.model('Worker', workerSchema);
