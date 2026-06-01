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
  },
  refreshToken: {
    type: String,
    default: null
  }
}, {
  timestamps: true // Auto-manages createdAt and updatedAt
});
```

### Constraints & Indexes
- **Email Uniqueness**: A unique index on `email` is established in MongoDB to prevent duplicate registrations.
- **Lowercase Conversion**: Email is forced to lowercase to ensure consistency and prevent case-sensitive duplicate registrations.
- **Trimming**: Spaces are trimmed from `email` and `name`.
- **Session Reference**: A simple `refreshToken` field on the user model tracks active login sessions directly inside the User document, avoiding external collections.

