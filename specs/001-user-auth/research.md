# Technical Research: User Authentication API

This document details the architectural decisions, best practices, and alternatives evaluated for the User Authentication module.

---

## 1. Password Hashing: bcryptjs vs bcrypt (Native C++)

- **Decision**: Use `bcryptjs` for password hashing, with 10 salt rounds.
- **Rationale**: While the native C++ `bcrypt` library offers faster execution due to compiled code, it often requires native compilation tools (`node-gyp`, Python, C++ compiler) which can cause platform-compatibility issues across different developer systems (especially between Windows, macOS, and Linux). `bcryptjs` is a pure JavaScript implementation that requires zero native compilation, guaranteeing cross-platform portability. 10 salt rounds are standard in the industry, taking around 50–100ms per hash, balancing strong security with low CPU load.
- **Alternatives Considered**:
  - **bcrypt (Native)**: Rejected due to frequent installation/compilation failures on development machines.
  - **Argon2**: High memory/CPU cost, slightly too complex for this lightweight project scope.

---

## 2. JWT Lifespans & Storage Strategy

- **Decision**: 
  - **Access Token**: Short-lived (15 minutes). Sent in the JSON response payload.
  - **Refresh Token**: Long-lived (7 days). Stored in a database collection for tracking/revocation, and returned in the login response payload as requested (or securely delivered as an HTTPOnly cookie).
- **Rationale**: Access tokens are stateless, meaning they cannot be revoked before they expire. Keeping them short-lived (15 minutes) limits the window of opportunity if a token is intercepted. Refresh tokens are stateful and verified against the database. Storing them in MongoDB allows us to invalidate them immediately on logout.
- **Alternatives Considered**:
  - **Stateless-only JWT sessions**: Rejected because we cannot immediately invalidate sessions during logout.
  - **Session-based authentication (Redis)**: Rejected to keep our database dependencies simple (MongoDB only) and align with standard JWT stateless route protections.

---

## 3. Database Token Purging (MongoDB TTL Indexes)

- **Decision**: Implement MongoDB TTL (Time-To-Live) index on the RefreshToken schema's `expiresAt` field.
- **Rationale**: Refresh tokens eventually expire. Manually running cron jobs to clean them up creates unnecessary background overhead. MongoDB allows setting a TTL index that automatically deletes documents when their `expiresAt` timestamp is in the past. Mongoose allows declaring this natively via the schema definition: `{ expires: 0 }`.
- **Alternatives Considered**:
  - **Manual deletion cron job**: Rejected due to additional codebase complexity.
  - **Permanent storage**: Rejected as it causes database bloat.

---

## 4. Route Protection Authorization Header Scheme

- **Decision**: Use the standard `Authorization: Bearer <token>` header pattern.
- **Rationale**: Industry standard for RESTful token-based authentication. The middleware reads the `Authorization` header, splits the string to extract the token, verifies the signature using `jsonwebtoken`, and extracts the payload (user ID, email). If valid, it appends the decoded payload as `req.user` and calls `next()`.
- **Alternatives Considered**:
  - **Custom query parameter auth**: Rejected due to token exposure in server logs.
  - **Custom header fields**: Rejected as it breaks REST best practices.

---

## 5. Multer 2MB Limit Implementation

- **Decision**: Configure Multer's limits setting: `limits: { fileSize: 2 * 1024 * 1024 }` (2,097,152 bytes) globally.
- **Rationale**: Enforcing the 2MB image limit at the Multer middleware layer ensures that oversized payloads are rejected immediately, protecting server CPU and memory from processing large file streams, and avoiding unnecessary Cloudinary storage costs.
- **Alternatives Considered**:
  - **Post-upload size check**: Rejected because the file would have already been fully written to the disk/memory or uploaded to Cloudinary, violating security and optimization principles.
