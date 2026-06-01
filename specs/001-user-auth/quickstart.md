# Quickstart Guide: User Authentication API

This guide provides rapid setup, run, and testing instructions for the User Authentication module.

---

## 1. Environment Configuration

Create a `.env` file in the root of the repository and add the following configurations:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/intern-task-db
JWT_ACCESS_SECRET=your_super_secret_short_lived_access_key_12345
JWT_REFRESH_SECRET=your_super_secret_long_lived_refresh_key_54321
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name # Prepared for future uploads
```

---

## 2. Installation & Running

Initialize dependencies and run the server locally:

```bash
# 1. Install dependencies
npm install

# 2. Run the development server with live reload
npm run dev

# 3. Or start the production server
npm start
```

---

## 3. API Usage (cURL Examples)

### A. Signup (User Registration)
Register a new user:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123!",
    "gender": "male"
  }'
```

### B. Login (Session Inception)
Authenticate and obtain tokens:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```
*Note: Save the `accessToken` and `refreshToken` from the response payload.*

### C. Protected Route (Accessing with JWT Middleware)
Access a mock secure route using the `accessToken`:
```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

### D. Logout (Session Invalidation)
Revoke the refresh token:
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<YOUR_REFRESH_TOKEN>"
  }'
```

---

## 4. Verification & Testing

Execute unit and integration tests:

```bash
# Run the test suite via Jest
npm test

# Run tests with coverage report
npm run test:coverage
```
