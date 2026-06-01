# Data Model: User Authentication API

This document describes the database schemas and relationships for User Authentication.

---

## 1. User Schema

The User schema stores the registered account details. 

### Mongoose Schema Definition

```javascript
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
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
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: {
      values: ['male', 'female', 'other'],
      message: 'Gender must be male, female, or other'
    }
  }
}, {
  timestamps: true // Auto-manages createdAt and updatedAt
});
```

### Constraints & Indexes
- **Email Uniqueness**: A unique index on `email` is established in MongoDB to prevent duplicate registrations.
- **Lowercase Conversion**: Email is forced to lowercase to ensure consistency and prevent case-sensitive duplicate registrations.
- **Trimming**: Spaces are trimmed from `email` and `name`.

---

## 2. RefreshToken Schema

The RefreshToken schema stores long-lived tokens issued during login.

### Mongoose Schema Definition

```javascript
const mongoose = require('mongoose');

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
    index: { expires: 0 } // TTL index: documents are automatically deleted at this timestamp
  }
}, {
  timestamps: true
});
```

### Constraints & Indexes
- **Token Uniqueness**: A unique index on the `token` field is created.
- **TTL Index**: An index on the `expiresAt` field with `expires: 0` is set up. MongoDB's background thread will automatically purge expired refresh tokens from the database once the `expiresAt` time is reached.
- **Relationship**: Reference (`ref: 'User'`) binds each token to its corresponding owner user.
