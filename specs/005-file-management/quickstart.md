# File Management API Quickstart

This document contains instructions for executing and verifying File Management operations.

## Endpoints

### 1. Upload File (`POST /api/files/upload`)
- **Headers**:
  - `Authorization: Bearer <JWT_ACCESS_TOKEN>`
  - `Content-Type: multipart/form-data`
- **Request Body**:
  - `image`: Binary file (JPEG/PNG, max 2MB)
- **Response (200 OK)**:
  ```json
  {
    "message": "File uploaded successfully",
    "secure_url": "https://res.cloudinary.com/de8gnyqey/image/upload/v1726000000/profile_pictures/abc.png",
    "public_id": "profile_pictures/abc"
  }
  ```

### 2. Delete File (`DELETE /api/files/delete`)
- **Headers**:
  - `Authorization: Bearer <JWT_ACCESS_TOKEN>`
  - `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "public_id": "profile_pictures/abc"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "File deleted successfully from Cloudinary"
  }
  ```

## Swagger UI Testing

1. Open Chrome at: `http://localhost:5000/api/docs`
2. Authenticate using your Bearer token.
3. Locate the **Files** tag.
4. Try out `POST /api/files/upload` by selecting an image file from your machine directly in the Swagger UI.
