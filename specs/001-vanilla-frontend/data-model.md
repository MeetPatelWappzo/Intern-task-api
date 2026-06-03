# Data Model: Vanilla Frontend

## Entities

### User Profile
The frontend will handle the following user profile data from the API:

- `email`: String (Required, unique)
- `fullName`: String (Required)
- `gender`: Enum (`male`, `female`, `other`)
- `profileUrl`: String (URL to uploaded image, optional)
- `address`: String (Optional)
- `universityName`: String (Optional)
- `city`: String (Optional)
- `guardianName`: String (Optional)
- `guardianPhoneNumber`: String (Optional)
- `personalMobileNumber`: String (Optional)

### Task
The frontend will handle the following task data:

- `_id`: String (Unique identifier from MongoDB)
- `title`: String (Required, read-only on edit)
- `description`: String
- `priority`: Enum (`epic`, `high`, `medium`, `low`)
- `status`: Enum (`pending`, `in-progress`, `completed`)
- `createdAt`: Date
- `updatedAt`: Date

## State Management
State is strictly local to each page's DOM and Javascript closures.
- **Authentication**: `accessToken` stored in `localStorage`.
- **Tasks**: Stored in a local array variable `let currentTasks = []` in `dashboard.js`, which is mapped to DOM nodes (cards). When a filter is applied, the DOM is updated based on this array.
