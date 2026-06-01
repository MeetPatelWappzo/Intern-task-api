# Technical Research: Refactored Authentication & Profile Schema

This document details the research, benefits, and implementation patterns selected for our 1-to-1 split schema and simplified stateless session token strategy.

---

## 1. 1-to-1 Model Split: Auth vs Profile

- **Decision**: Separate credentials (`Auth`) and user-descriptive parameters (`Profile`) into two independent collections linked by a unique `authId` reference.
- **Rationale**:
  - **Performance Optimization**: Login operations only query and load credentials (`Auth`), which are small, highly indexed documents (only email and password), reducing index page footprint and DB read times.
  - **Security Separation**: Descriptive personal details (mobile numbers, address) are separated from credential parameters.
  - **Scalability**: As more user profile parameters are added, the credential verification collection remains compact and unaffected.
- **Alternatives Considered**:
  - **Single Document Schema (Old User Model)**: Rejected because descriptive profile fields bloat the core indexing collection, reducing efficiency during credential checks.

---

## 2. Token Cleanup: Single Stateless JWT (AccessToken-Only)

- **Decision**: Completely delete RefreshToken collections and Mongoose models. Rely strictly on a single stateless `accessToken` (JWT).
- **Rationale**: Simplifying session mechanisms removes database locking and write operations during auth requests. The JWT access token contains the decoded `authId` in its payload, allowing standard route protection middleware to verify signatures statelessly in O(1) time.
- **Alternatives Considered**:
  - **Redis Sessions**: Introduces Redis dependency, increasing server cost.
  - **Access + Refresh Token**: Rejected due to unnecessary schema complexing, matching the explicit refactoring instructions.

---

## 3. Database Integrity & Cascade Purges

- **Decision**: Add a pre-remove/pre-deleteOne hook in `auth.model.js` to automatically clean up the associated `Profile` record when an `Auth` record is deleted.
- **Rationale**: Since the database maintains a strict 1-to-1 mapping, deleting credentials without removing the profile results in orphaned profiles. A database-level pre-hook guarantees referential integrity.
- **Alternatives Considered**:
  - **Manual Controller Deletion**: High risk of Developer oversight leading to memory leaks and orphaned profile data.
