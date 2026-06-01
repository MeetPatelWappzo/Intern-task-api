# Feature Specification: User Profile & File Upload

**Feature Branch**: `003-user-profile-upload`  
**Created**: 2026-06-01  
**Status**: Draft  
**Input**: User description: "Create the backend API specification for Phase 2: User Profile & File Upload. This integrates with the newly created Auth/Profile models. Tech Stack: Multer, Cloudinary storage. Middleware: Apply the JWT auth middleware (verifying the accessToken) to protect these routes. Add a Multer upload middleware restricted to a single image file (.jpg, .jpeg, .png) with a strict size limit of 2MB. Endpoints: GET /api/profile: Uses the logged-in user's authId from the JWT to fetch and return their linked Profile document. PATCH /api/profile: Accepts profile text fields (fullName, address, universityName, etc.) and handles the single image upload. Uploads the image to Cloudinary, stores the resulting secure URL in the Profile document's profileUrl field, saves the text updates, and returns the updated profile."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Retrieve Profile Information (Priority: P1)

As an authenticated user, I want to fetch my current profile details so that I can see my stored personal, academic, and contact information.

**Why this priority**: Retrieving profile data is a baseline requirement for any user interaction. It ensures the link between Auth and Profile databases is functioning correctly before modifications are allowed.

**Independent Test**: Send a GET request to `/api/profile` with a valid JWT. Assert that the returned body contains the correct profile fields matching the authenticated user.

**Acceptance Scenarios**:

1. **Given** an authenticated user with a valid JWT, **When** they make a GET request to `/api/profile`, **Then** the system MUST return a status code of 200 along with the complete profile information.
2. **Given** an unauthenticated visitor with no JWT or an invalid token, **When** they make a GET request to `/api/profile`, **Then** the system MUST return a status code of 401 (Unauthorized) with an appropriate error message.

---

### User Story 2 - Update Profile Details and Avatar (Priority: P2)

As an authenticated user, I want to update my profile information and upload a profile picture so that my profile stays current and includes a visual representation of myself.

**Why this priority**: Modifying profile details and uploading avatar images is a critical user flow that enhances personalization and completes the basic operations on the profile resource.

**Independent Test**: Send a PATCH request to `/api/profile` with text fields and a valid image file. Assert that the profile is updated in the database and the response contains the updated details including a secure image URL.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they submit a PATCH request to `/api/profile` containing valid text fields and a valid image (.jpg, .jpeg, or .png under 2MB), **Then** the system MUST upload the image to remote storage, save all updates to the database, and return a status code of 200 with the fully updated profile details.
2. **Given** an authenticated user, **When** they submit a PATCH request to `/api/profile` containing an image larger than 2MB, **Then** the system MUST reject the upload, make no changes in the database, and return a status code of 400 (Bad Request) with a clear size error message.
3. **Given** an authenticated user, **When** they submit a PATCH request to `/api/profile` containing an unsupported file type (e.g., .gif, .pdf), **Then** the system MUST reject the upload, make no changes in the database, and return a status code of 400 (Bad Request) with a clear format error message.

---

### Edge Cases

- **Missing Profile**: If an Auth record exists but the corresponding Profile document is missing, fetching or patching the profile should gracefully return a 404 (Not Found) error and prompt profile recreation.
- **Partial Updates**: If the user submits a PATCH request with only some text fields and no image, or only an image and no text fields, the system should correctly update only the provided fields while leaving all other existing fields unchanged.
- **Storage Upload Failure**: If the image upload to Cloudinary fails due to network issues or API limits, the database update must not be performed, and the system should return a 500 (Internal Server Error) with a friendly error message, preserving original profile data.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST protect both retrieval and update endpoints by requiring a valid JWT stateless `accessToken` in the Authorization header.
- **FR-002**: The system MUST extract the `authId` from the verified JWT payload to identify the correct profile owner.
- **FR-003**: The GET `/api/profile` endpoint MUST return all key fields including `fullName`, `gender`, `address`, `universityName`, `city`, `guardianName`, `guardianPhoneNumber`, `personalMobileNumber`, and `profileUrl`.
- **FR-004**: The PATCH `/api/profile` endpoint MUST allow updating one, multiple, or all profile text fields and/or the profile image.
- **FR-005**: The system MUST restrict profile image uploads strictly to formats `.jpg`, `.jpeg`, and `.png`.
- **FR-006**: The system MUST enforce a strict file size limit of 2MB for the profile image upload.
- **FR-007**: When an image is uploaded, the system MUST store the file in secure remote cloud storage (Cloudinary) and save the resulting secure URL to the `profileUrl` field.
- **FR-008**: All updates MUST be applied transactionally or sequentially so that if image storage or database updates fail, no partial or corrupt state is saved.

### Key Entities

- **Profile**: Represents the descriptive details of a user.
  - `authId`: Reference link to the security credentials (Auth).
  - `fullName`: String (e.g. John Doe).
  - `gender`: String (e.g. male, female, other).
  - `profileUrl`: String containing secure URL pointing to the uploaded image in Cloudinary.
  - `address`: String.
  - `universityName`: String.
  - `city`: String.
  - `guardianName`: String.
  - `guardianPhoneNumber`: String.
  - `personalMobileNumber`: String.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Authenticated users can retrieve their profile details with a page/API response time of under 100ms.
- **SC-002**: 100% of invalid or unauthorized requests to retrieve or modify profiles are blocked and return a 401 Unauthorized response.
- **SC-003**: 100% of uploaded images exceeding the 2MB size limit are rejected immediately without being sent to remote storage or writing to the database.
- **SC-004**: 100% of unsupported file formats are rejected before saving, with a clear rejection feedback message.
