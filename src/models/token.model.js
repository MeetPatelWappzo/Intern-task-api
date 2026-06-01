const mongoose = require('mongoose');

/**
 * Refresh Token Database Schema
 */
const RefreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // TTL Index: Auto-purges expired sessions
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
