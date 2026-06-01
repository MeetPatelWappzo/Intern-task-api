# Technical Research: File Management Module

## Decisions

### 1. Cloud Storage Integration (Cloudinary)
- **Decision**: Leverage the existing configured `cloudinary` instance and reuse `src/services/cloudinary.service.js` for uploading files from memory buffer. Extend the service to export a custom `deleteImage` wrapper calling `cloudinary.uploader.destroy`.
- **Rationale**: Keeps the codebase DRY and avoids duplicate configuration. Memory storage in Multer prevents temporary local files, which is cloud-native and highly compatible with serverless environments (e.g. Render, Railway).
- **Alternatives Considered**: Direct local disk storage (rejected due to persistence issues on ephemeral container platforms).

### 2. Media Deletion
- **Decision**: Perform atomic asset destruction via `cloudinary.uploader.destroy(public_id)` inside the controller or service.
- **Rationale**: Direct integration with Cloudinary's secure asset management API is instant and highly reliable.
- **Alternatives Considered**: Cron-based background cleanup (rejected because instantaneous user-facing delete is expected).

### 3. Middleware Integration
- **Decision**: Utilize the existing `verifyToken` for JWT authentication and the existing `upload` Multer middleware for single image validation.
- **Rationale**: Reuses thoroughly tested and validated middleware patterns without introducing complex custom upload handlers.
