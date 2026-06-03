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
    "file": {
      "id": "60d5ecb8b392d7...",
      "secure_url": "https://res.cloudinary.com/...",
      "public_id": "profile_pictures/abc"
    }
  }
  ```

### 2. Delete File (`DELETE /api/files/delete?public_id=YOUR_PUBLIC_ID`)
- **Headers**:
  - `Authorization: Bearer <JWT_ACCESS_TOKEN>`
- **Query Parameters**:
  - `public_id`: The Cloudinary public ID returned during upload.
- **Request Body**: None.
- **Response (200 OK)**:
  ```json
  {
    "message": "File deleted successfully"
  }
  ```

## Swagger UI Testing
Open your browser at your API URL: `http://localhost:5002/api/docs`

Authenticate using your Bearer token.
Locate the Files tag to test upload and deletion directly.
