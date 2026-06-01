# Quickstart Guide: Refactored Authentication & Profile Schema

This guide assists in setting up and testing the refactored Auth/Profile API.

---

## 1. Environment Configuration

Bootstrap your `.env` file using the new `.env.example` at the root of the project:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/intern-task-db
JWT_SECRET=your_jwt_signature_secret_key_12345
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

---

## 2. API Usage (cURL Examples)

### A. Signup (Auth + Profile Split Creation)
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "refactor@example.com",
    "password": "SecurePassword123!",
    "fullName": "John Doe",
    "gender": "male"
  }'
```

### B. Login (JWT Access Token Generation)
Returns ONLY the accessToken:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "refactor@example.com",
    "password": "SecurePassword123!"
  }'
```

### C. Protected Route (Accessing with Access Token Middleware)
```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

---

## 3. Testing

Verify refactored models and router:
```bash
npm test
```
