const mongoose = require('mongoose');

/**
 * Profile Descriptive Database Schema
 */
const ProfileSchema = new mongoose.Schema({
  authId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: {
      values: ['male', 'female', 'other'],
      message: 'Gender must be male, female, or other'
    }
  },
  profileUrl: {
    type: String,
    default: null
  },
  address: {
    type: String,
    default: null
  },
  universityName: {
    type: String,
    default: null
  },
  city: {
    type: String,
    default: null
  },
  guardianName: {
    type: String,
    default: null
  },
  guardianPhoneNumber: {
    type: String,
    default: null
  },
  personalMobileNumber: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', ProfileSchema);
