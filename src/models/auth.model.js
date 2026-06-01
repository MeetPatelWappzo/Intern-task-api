const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Auth Credentials Database Schema
 */
const AuthSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  }
}, {
  timestamps: true
});

// Pre-save middleware to hash passwords
AuthSchema.pre('save', async function (next) {
  const auth = this;
  
  if (!auth.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    auth.password = await bcrypt.hash(auth.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance method to compare plain text passwords with database hash
 * @param {string} candidatePassword - Plain text password input
 * @returns {Promise<boolean>} - Resolves true if passwords match
 */
AuthSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Auth', AuthSchema);
