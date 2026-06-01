# Technical Design: File Management Data Model

Since file assets are hosted on Cloudinary, we do not require a separate database collection. The files are referenced statelessly by client applications using the returned URL and public ID.

## File Asset Structure (Stateless)

| Field | Type | Description | Validation |
|---|---|---|---|
| `public_id` | String | Cloudinary identifier | Required for deletion, alpha-numeric with folder prefixes |
| `secure_url` | String (URL) | Secure HTTPS asset link | Valid URL starting with `https://res.cloudinary.com/` |

## Validation Rules

1. **Upload Size**: File size must not exceed `2,097,152` bytes (2MB).
2. **File Types**: Mime-type must match `image/jpeg` or `image/png`.
3. **Authentication**: All endpoints require a valid JWT `accessToken` in the `Authorization: Bearer <token>` header.
