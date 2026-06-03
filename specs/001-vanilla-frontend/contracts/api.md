# API Contracts: Vanilla Frontend

The frontend will act as a consumer of the following REST APIs.

## Authentication

### 1. Signup
- **Endpoint**: `POST /api/auth/signup`
- **Headers**: `Content-Type: application/json`
- **Body**: 
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "strongpassword",
    "gender": "male"
  }
  ```
- **Response**: `201 Created`

### 2. Login
- **Endpoint**: `POST /api/auth/login`
- **Headers**: `Content-Type: application/json`
- **Body**: 
  ```json
  {
    "email": "john@example.com",
    "password": "strongpassword"
  }
  ```
- **Response**: `200 OK` (returns `{ "token": "jwt_string_here" }`)

## Tasks

### 3. Get All Tasks
- **Endpoint**: `GET /api/tasks`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` (Array of task objects)

### 4. Create Task
- **Endpoint**: `POST /api/tasks`
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body**:
  ```json
  {
    "title": "Task Title",
    "description": "Task Description",
    "priority": "high"
  }
  ```
- **Response**: `201 Created`

### 5. Update Task Status
- **Endpoint**: `PATCH /api/tasks/:id/status`
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body**:
  ```json
  {
    "status": "completed"
  }
  ```
- **Response**: `200 OK`

### 6. Edit Task (Description & Priority)
- **Endpoint**: `PATCH /api/tasks/:id`
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body**:
  ```json
  {
    "description": "Updated description",
    "priority": "epic"
  }
  ```
- **Response**: `200 OK`

## Profile

### 7. Get Profile
- **Endpoint**: `GET /api/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` (User object)

### 8. Update Profile (Multipart)
- **Endpoint**: `PATCH /api/profile`
- **Headers**: `Authorization: Bearer <token>` (Do NOT set Content-Type manually, let browser set boundary)
- **Body**: `FormData` containing text fields (`fullName`, `gender`, `address`, `universityName`, `city`, `guardianName`, `guardianPhoneNumber`, `personalMobileNumber`) and optionally a File blob (`image`).
- **Response**: `200 OK`
