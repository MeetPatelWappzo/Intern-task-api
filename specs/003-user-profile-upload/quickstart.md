# Quickstart Guide: Profile Retrieval & Multi-Part Image Uploads

This quickstart guides you through interacting with the profile services.

## Local Configuration Checklist
Ensure the following Cloudinary API configurations exist inside the active environment `.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 1. Retrieve Stored Profile
- **Method & Path**: `GET /api/profile`
- **Headers**:
  ```http
  Authorization: Bearer <your_jwt_accessToken>
  ```
- **Response Shape (200 OK)**:
  ```json
  {
    "id": "65b5974c5d5e5e4078cb8db2",
    "authId": "65b5974c5d5e5e4078cb8db1",
    "fullName": "John Doe",
    "gender": "male",
    "profileUrl": null,
    "address": null,
    "universityName": null,
    "city": null,
    "guardianName": null,
    "guardianPhoneNumber": null,
    "personalMobileNumber": null
  }
  ```

---

## 2. Update Profile & Upload Avatar File
- **Method & Path**: `PATCH /api/profile`
- **Headers**:
  ```http
  Authorization: Bearer <your_jwt_accessToken>
  Content-Type: multipart/form-data
  ```
- **Request Body (form-data)**:
  - `fullName`: `John Updated`
  - `universityName`: `Stanford University`
  - `profileImage`: `<Select File - Must be .png/.jpg/.jpeg and <2MB>`
- **Response Shape (200 OK)**:
  ```json
  {
    "id": "65b5974c5d5e5e4078cb8db2",
    "authId": "65b5974c5d5e5e4078cb8db1",
    "fullName": "John Updated",
    "gender": "male",
    "profileUrl": "https://res.cloudinary.com/your_cloud_name/image/upload/v1234567/profile_pictures/avatar.png",
    "address": null,
    "universityName": "Stanford University",
    "city": null,
    "guardianName": null,
    "guardianPhoneNumber": null,
    "personalMobileNumber": null
  }
  ```
