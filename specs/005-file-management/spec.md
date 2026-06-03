# Feature Specification: File Management Module

**Feature Branch**: `005-file-management`  
**Created**: 2026-06-03  
**Status**: Ready for Implementation  

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Secure single-file image upload (Priority: P1)

As an authenticated user, I want to upload an image, so that I can store my visual assets securely in the cloud.

**Acceptance Scenarios**:

1. **Given** a user has a valid JWT, **When** they make a `POST /api/files/upload` request with a valid image file (<2MB) in the `image` field, **Then** the system MUST upload the image to Cloudinary, save a tracking record to the database linking the `public_id` to the user's `authId`, and return a 200 OK status.
2. **Given** a user uploads an invalid file type or exceeds 2MB, **Then** the system MUST return a 400 Bad Request.

---

### User Story 2 - Secure file deletion (Priority: P2)

As an authenticated user, I want to delete my uploaded image assets.

**Acceptance Scenarios**:

1. **Given** a user has a valid JWT, **When** they make a `DELETE /api/files/delete?public_id=xxx` request, **Then** the system MUST query the database. If the file's `authId` matches the user's JWT ID, it deletes the file from Cloudinary and MongoDB.
2. **Given** a user attempts to delete a `public_id` belonging to a different user, **Then** the system MUST block the request and return a 403 Forbidden.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST expose `POST /api/files/upload` to upload a single image via `multipart/form-data` (field: `image`). Limit 2MB, JPEG/PNG only.
- **FR-002**: Uploads MUST be saved to Cloudinary, and a corresponding document MUST be created in the `File` MongoDB collection storing the `public_id`, `secure_url`, and the uploading user's `authId`.
- **FR-003**: System MUST expose `DELETE /api/files/delete`. It MUST accept the target file via a URL Query Parameter (`?public_id=`), NOT a JSON body.
- **FR-004**: The deletion controller MUST strictly verify ownership. It must find the file in MongoDB by `public_id` and confirm the `authId` matches the authenticated user before executing the Cloudinary destroy command.
- **FR-005**: All endpoints MUST be documented with Swagger JSDoc.
