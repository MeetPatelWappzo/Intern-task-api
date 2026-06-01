# Data Model Design: Task Schema

This document details the Task schema and its validations.

## Entity: Task
Represents an actionable item managed by authenticated owners.

### Schema Structure (Mongoose)

```javascript
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  priority: {
    type: String,
    required: true,
    enum: ['epic', 'high', 'medium', 'low'],
    default: 'medium'
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  authId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    required: true
  }
}, {
  timestamps: true
});
```

### Constraints & Validations

1. **Title Validation**: Required, string, trimmed. Cannot be updated after task creation.
2. **Priority Validation**: Restrained strictly to: `epic`, `high`, `medium`, `low`.
3. **Status Validation**: Restrained strictly to: `pending`, `in-progress`, `completed`.
4. **Ownership Constraints**: Every query enforces matching matching `authId` properties.
