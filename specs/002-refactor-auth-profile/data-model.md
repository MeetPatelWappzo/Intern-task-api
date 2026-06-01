# Data Model: Refactored Authentication & Profile Schema

This document details the database models and schemas for the refactored Auth and Profile split design.

---

## 1. Auth Schema (`Auth`)

Stores security credentials and login identifiers.

### Mongoose Schema Definition

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// Hash password pre-save hook
AuthSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password helper
AuthSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
```

---

## 2. Profile Schema (`Profile`)

Stores descriptive personal information and references the Auth document.

### Mongoose Schema Definition

```javascript
const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  authId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    required: true,
    unique: true // Guarantees strict 1-to-1 referential mapping
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
```
