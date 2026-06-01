# Feature Specification: Refactored Authentication & Profile Schema

**Feature Branch**: `002-refactor-auth-profile`  
**Created**: 2026-06-01  
**Status**: Draft  
**Input**: User description: "Refactor architecture. Environment: Create a .env.example file at the root containing placeholder variables for PORT, MONGO_URI, JWT_SECRET, and Cloudinary credentials. Token Cleanup: Completely remove all Refresh Token logic and models. The API must only generate and rely on a single accessToken (JWT). Schema Split (1-to-1): Delete the old User model. Create two new models: Auth Model: strictly contains email (unique) and password (hashed). Profile Model: contains authId (ObjectId referencing Auth), fullName, gender, profileUrl, address, universityName, city, guardianName, guardianPhoneNumber, and personalMobileNumber. Controller Updates: Update the signup controller so that when a user registers, it creates the Auth document and immediately creates an empty/default Profile document linked to that Auth ID. Update login to return only the accessToken."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Secure Signup with Schema Split (Priority: P1)

As a new visitor to the platform, I want to sign up by providing my email, password, full name, and gender, so that the system creates my login credentials (Auth) and initializes my profile (Profile) automatically.

**Why this priority**: Core registration flow that populates the split database architecture correctly and links credentials to profile.

**Independent Test**: Send a POST request to `/api/auth/signup` with a valid payload. Verify that two separate documents are created in the database: one in the Auth collection (storing email and hashed password) and one in the Profile collection (storing full name, gender, and referencing the Auth document ID).

**Acceptance Scenarios**:
1. **Given** no existing user with the email `refactor@example.com`, **When** a registration request is submitted with name "Jane Doe", email "refactor@example.com", password "SecurePassword123!", and gender "female", **Then** the system MUST create the Auth record, create a linked Profile record with "Jane Doe" and gender "female", return `201 Created`, and return a success message with the created profile details (excluding password).
2. **Given** a user already exists with the email `refactor@example.com`, **When** a registration request is made with the same email, **Then** the system MUST reject it and return `409 Conflict`.
3. **Given** a registration request is submitted, **When** any mandatory registration field is missing or malformed, **Then** the system MUST reject it and return `400 Bad Request`.

---

### User Story 2 - User Login with Single JWT (Priority: P1)

As a registered user, I want to log in using my email and password, so that the system returns a single, stateless access token without any refresh tokens.

**Why this priority**: Required for users to authenticate post-registration and access secure endpoints. Simplifies the authentication flow by removing refresh token complexity.

**Independent Test**: Send a POST request to `/api/auth/login` with correct credentials. Verify that the response returns only the `accessToken` in the payload (no refresh tokens or other credentials).

**Acceptance Scenarios**:
1. **Given** valid registered credentials, **When** a login request is made, **Then** the system MUST return `200 OK` and a payload containing only `accessToken` and user basic profile metadata (no refresh token).
2. **Given** invalid credentials, **When** a login request is made, **Then** the system MUST return `401 Unauthorized` with a generic failure message.

---

### User Story 3 - Protected Route Access with Middleware (Priority: P2)

As an authenticated user, I want to access protected endpoints using my access token, so that only validated requests are processed.

**Why this priority**: Secures sensitive endpoints against unauthorized requests.

**Independent Test**: Access `/api/tasks` using the access token, showing that a valid token yields task details while missing or expired tokens return `401 Unauthorized`.

**Acceptance Scenarios**:
1. **Given** a protected resource endpoint, **When** a request includes a valid access token in the `Authorization: Bearer <token>` header, **Then** the system MUST allow it and return `200 OK`.
2. **Given** a protected resource endpoint, **When** the token is missing, expired, or malformed, **Then** the system MUST block it and return `401 Unauthorized`.

---

### Edge Cases

- **Partial Creation Failures (Database Transactions)**: What happens if the `Auth` document is saved successfully, but the linked `Profile` document creation fails (e.g., due to duplicate key or schema validation)? The signup flow must clean up/rollback the saved Auth document (or use transactions) to prevent dangling, orphaned Auth credentials without profiles.
- **Null Profile Fields Handling**: How does the system handle optional profile fields (like address or city) during query and profile updates? The profile schema must set standard default values (`null` or empty strings) for unsupplied fields.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001 (Schema Split)**: The database model MUST be split 1-to-1 into two separate collections:
  - **Auth**: Contains `email` (unique, required) and `password` (hashed, required).
  - **Profile**: Contains `authId` (ObjectId referencing Auth, required, unique), `fullName` (string, required), `gender` (enum: male/female/other, required), `profileUrl` (string, default: null), `address` (string, default: null), `universityName` (string, default: null), `city` (string, default: null), `guardianName` (string, default: null), `guardianPhoneNumber` (string, default: null), and `personalMobileNumber` (string, default: null).
- **FR-002 (Token Simplification)**: The system MUST completely remove all Refresh Token logic, schemas, and models. The authentication flow MUST rely strictly on a single stateless `accessToken` (JWT).
- **FR-003 (Signup Controller Refactor)**: During user registration, the signup controller MUST create the `Auth` document, hash the password, and immediately save a linked `Profile` document referencing the `Auth` ID, setting required values and defaulting others to `null`.
- **FR-004 (Login Controller Refactor)**: Upon valid credentials validation during login, the system MUST return only the `accessToken` in the response payload.
- **FR-005 (Route Protection)**: The JWT verification middleware MUST validate requests using the single stateless `accessToken`.
- **FR-006 (Environment Config)**: A `.env.example` file MUST be created at the root of the repository containing placeholder variables for `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, and `CLOUDINARY_CLOUD_NAME`.

### Key Entities *(include if feature involves data)*

- **Auth**:
  - **email**: String, unique, lowercase, trimmed, required.
  - **password**: Securely hashed string, required.
- **Profile**:
  - **authId**: ObjectId referencing `Auth`, required, unique.
  - **fullName**: String, required, trimmed.
  - **gender**: String, required, enum: ["male", "female", "other"].
  - **profileUrl**: String, default: null.
  - **address**: String, default: null.
  - **universityName**: String, default: null.
  - **city**: String, default: null.
  - **guardianName**: String, default: null.
  - **guardianPhoneNumber**: String, default: null.
  - **personalMobileNumber**: String, default: null.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of successful signups result in exactly one linked pair of Auth and Profile documents in the database.
- **SC-002**: Token invalidation and session tracking contains 0% Refresh Token dependency.
- **SC-003**: Access token validation middleware latency overhead remains under 5 milliseconds.
- **SC-004**: Database maintains absolute 1-to-1 consistency between Auth and Profile collections.
