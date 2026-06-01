# Feature Specification: File Management Module

**Feature Branch**: `005-file-management`  
**Created**: 2026-06-01  
**Status**: Draft  
**Input**: User description: "Create a dedicated File Management module using the existing Multer and Cloudinary configurations. Routes & Controllers: Create routes/file.routes.js and controllers/file.controller.js. Mount the routes in app.js under /api/files. Middleware: Both routes must be protected by the existing JWT verifyToken middleware. Endpoints: POST /api/files/upload, DELETE /api/files/delete. Swagger Specs: Include multipart/form-data support so it can be tested directly from Swagger UI."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Secure single-file image upload (Priority: P1)

As an authenticated user, I want to upload an image to the API, so that I can store my visual assets securely in the cloud and retrieve their URLs.

**Why this priority**: Core requirement for the file management system to enable other features (like user profiles or task attachments) to use uploaded assets.

**Independent Test**: Can be fully tested by sending a POST request to `/api/files/upload` with a valid JWT token and a sample PNG/JPEG image under 2MB in the `image` field. The response should contain a 200 status code with a valid HTTPS Cloudinary URL and public ID.

**Acceptance Scenarios**:

1. **Given** a user has a valid JWT token, **When** they make a `POST /api/files/upload` request with a valid image file (.jpg, .jpeg, or .png) under 2MB in the `image` form-data field, **Then** the system MUST upload the image to Cloudinary and return a 200 OK status with a JSON payload containing the secure URL and the public ID.
2. **Given** a user does NOT have a valid JWT token, **When** they attempt to upload an image, **Then** the system MUST block the request and return a 401 Unauthorized status with a JSON error message.
3. **Given** a user has a valid JWT token, **When** they upload a file that is not an image (e.g., a PDF or text file) OR an image exceeding the 2MB size limit, **Then** the system MUST return a 400 Bad Request status with a clear and descriptive JSON error message.
4. **Given** a user has a valid JWT token, **When** they make the request without any file attached, **Then** the system MUST return a 400 Bad Request status with a descriptive JSON error message indicating that the file is missing.

---

### User Story 2 - Secure file deletion (Priority: P2)

As an authenticated user, I want to delete my uploaded image assets from cloud storage, so that I can manage my storage space and remove stale files.

**Why this priority**: Ensures data hygiene and allows clean-up of assets that are no longer in use, saving storage resources.

**Independent Test**: Can be fully tested by sending a DELETE request to `/api/files/delete` with a valid JWT token and a valid Cloudinary `public_id` in the JSON body. The response should be a 200 OK success message, and the asset should no longer be accessible on Cloudinary.

**Acceptance Scenarios**:

1. **Given** a user has a valid JWT token, **When** they make a `DELETE /api/files/delete` request with a valid, existing `public_id` in the JSON body, **Then** the system MUST call the Cloudinary API to delete the asset, and return a 200 OK status with a JSON success message.
2. **Given** a user does NOT have a valid JWT token, **When** they attempt to delete a file, **Then** the system MUST block the request and return a 401 Unauthorized status with a JSON error message.
3. **Given** a user has a valid JWT token, **When** they make the request with a missing `public_id` field in the JSON body, **Then** the system MUST return a 400 Bad Request status with a descriptive JSON error message.
4. **Given** a user has a valid JWT token, **When** they make the request with a non-existent or invalid `public_id`, **Then** the system MUST handle the Cloudinary API response gracefully, and return a 200 success response or a descriptive error indicating the asset could not be found or deleted, ensuring the API behaves robustly.

---

### Edge Cases

- **Large file uploads**: A user attempts to upload a file slightly larger than 2MB or extremely large (e.g., 50MB). The system must handle this gracefully without server crashes, blocking the request at the middleware level.
- **Cloudinary Service Failure**: The Cloudinary API is down, returns an error, or there is a network timeout. The system must catch the error, log it, and return a clean 500 Internal Server Error to the client rather than leaking implementation details.
- **Multiple files uploaded**: A user attempts to send multiple files in the same request. Since the route expects a single file, the system must either ignore the extra files and process the first one or return a 400 error.
- **Concurrent uploads/deletions**: High-volume parallel requests should be handled efficiently using asynchronous code paths.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST expose a POST endpoint at `/api/files/upload` to upload a single image.
- **FR-002**: The `/api/files/upload` endpoint MUST support `multipart/form-data` requests with a form field named `image` for the file payload.
- **FR-003**: The `/api/files/upload` endpoint MUST restrict uploads to image files with extensions `.jpg`, `.jpeg`, and `.png` (mime-types `image/jpeg`, `image/png`).
- **FR-004**: The `/api/files/upload` endpoint MUST enforce a strict size limit of 2MB (2,097,152 bytes).
- **FR-005**: System MUST store uploaded images on Cloudinary and return the secure URL (`secure_url`) and public ID (`public_id`) in a 200 OK JSON response.
- **FR-006**: System MUST expose a DELETE endpoint at `/api/files/delete` accepting a JSON body with a `public_id` string field.
- **FR-007**: The `/api/files/delete` endpoint MUST parse the `public_id` from the request body and invoke the Cloudinary API (`cloudinary.uploader.destroy`) to delete the asset from cloud storage.
- **FR-008**: Both `/api/files/upload` and `/api/files/delete` endpoints MUST be protected by the existing JWT `verifyToken` middleware, verifying the request contains a valid bearer token.
- **FR-009**: All file management endpoints MUST be fully documented in Swagger/OpenAPI, including detailed JSDoc comments mapping request payloads (especially the binary file field in `multipart/form-data`) and responses so they are directly testable via the Swagger UI.

### Key Entities *(include if feature involves data)*

- **File Asset**: Represents a file stored in cloud storage.
  - `public_id` (string): Unique identifier for the asset in Cloudinary, used for reference and deletion.
  - `secure_url` (string): The HTTPS URL where the file can be downloaded or viewed publicly.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Authenticated users can upload an image file in less than 3 seconds under normal network conditions.
- **SC-002**: System successfully rejects 100% of files larger than 2MB and non-image files with clear, helpful 400 Bad Request errors.
- **SC-003**: Authenticated users can successfully delete uploaded images by passing the correct `public_id`, with the asset instantly removed from cloud storage.
- **SC-004**: All endpoints are fully secured, and any request without a valid JWT is blocked with a 401 Unauthorized response.
- **SC-005**: Swagger UI displays the upload endpoint with an interactive file upload button, enabling successful manual test execution of file uploads directly from the browser.
