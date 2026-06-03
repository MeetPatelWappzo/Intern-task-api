# Technical Design: File Management Data Model

To ensure secure asset ownership and prevent unauthorized deletions, file uploads must be tracked statefully in the MongoDB database. 

## Mongoose Schema: `File`

| Field | Type | Required | Description |
|---|---|---|---|
| `public_id` | String | Yes | Cloudinary unique identifier, used for API deletion. |
| `secure_url` | String | Yes | Secure HTTPS asset link (e.g., https://res.cloudinary.com/...). |
| `authId` | ObjectId | Yes | Reference to the `Auth` model. Enforces ownership so users can only delete their own files. |
| `createdAt` | Date | Auto | Timestamp of upload. |

## Validation Rules

1. **Upload Size**: File size must not exceed `2,097,152` bytes (2MB) (Enforced by Multer).
2. **File Types**: Mime-type must match `image/jpeg` or `image/png` (Enforced by Multer).
3. **Authentication**: All endpoints require a valid JWT `accessToken` in the `Authorization: Bearer <token>` header.
