# Data Model Design: Profile Schema

This document details the Profile descriptive schema and the validation structures.

## Entity: Profile
Defines descriptive personal, contact, and academic fields mapped in a 1-to-1 relationship with the primary `Auth` collection.

### Schema Structure (Mongoose)

```javascript
const profileSchema = new mongoose.Schema({
  authId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other']
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

### Validation Constraints

1. **Required Fields on Instantiation**:
   - `authId`: Reference validation (must refer to valid ObjectId).
   - `fullName`: String representation.
   - `gender`: Restrained to `male`, `female`, or `other`.
2. **File Checks**:
   - Limit: Exactly `2MB` (`2 * 1024 * 1024` bytes).
   - Formats: Mime types strictly verified as `image/jpeg` or `image/png`.
