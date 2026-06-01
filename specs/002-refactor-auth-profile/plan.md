# Implementation Plan: Refactored Authentication & Profile Schema

**Branch**: `002-refactor-auth-profile` | **Date**: 2026-06-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-refactor-auth-profile/spec.md`

## Summary

The goal of this architectural refactoring is to split the database model into a 1-to-1 relationship between user credentials (`Auth`) and user descriptive data (`Profile`), completely remove all database-stored refresh tokens and logic, and implement a single stateless JWT-based access token authentication system. Additionally, we will bootstrap a `.env.example` file for ease of onboarding.

## Technical Context

**Language/Version**: Node.js v20.x  
**Primary Dependencies**: Express.js, Mongoose, bcryptjs, jsonwebtoken, dotenv, multer, cloudinary  
**Storage**: MongoDB (Mongoose ODM)  
**Testing**: Jest, Supertest  
**Target Platform**: Node.js server  
**Project Type**: Single backend application (REST API)  
**Performance Goals**: Stateless auth token verification latency <2ms; signup database writes completed in a secure sequence.  
**Constraints**: strictly enforce a 2MB limit on image uploads (globally configured via Multer).  
**Scale/Scope**: Unified O(1) stateless authentication sessions.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Gate 1: Technology Stack Alignment**
  - Refactored stack uses Node.js, Express.js, Mongoose, bcryptjs, and jsonwebtoken. Fully compliant with Gate 1.
- [x] **Gate 2: RESTful API Design**
  - Refactored signup route is `/api/auth/signup` and login is `/api/auth/login`. Pluralized resources, standardized HTTP methods and codes.
- [x] **Gate 3: JSDoc & Swagger Documentation**
  - Refactored routes and controllers will maintain absolute JSDoc Swagger blocks.
- [x] **Gate 4: Media Upload Limits**
  - Shared Multer upload middleware continues to enforce the strict 2MB limit on files.
- [x] **Gate 5: Code Simplicity**
  - Simple Express MVC patterns remain. Model definitions are clean and modular.

## Project Structure

### Documentation (this feature)

```text
specs/002-refactor-auth-profile/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── auth.openapi.json # OpenAPI spec for refactored Authentication
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
.env.example                 # Placeholder environment configuration file [NEW]
src/
├── config/
│   └── db.js
├── middleware/
│   ├── auth.middleware.js    # Decodes stateless accessToken and binds user ID
│   └── upload.middleware.js
├── models/
│   ├── auth.model.js         # Auth Schema (email, password) [NEW]
│   └── profile.model.js      # Profile Schema (authId, fullName, gender, etc.) [NEW]
├── controllers/
│   └── auth.controller.js    # Refactored signup and login handlers
├── routes/
│   └── auth.routes.js
├── app.js
└── server.js
```

**Structure Decision**: modularized MVC directory structure. We are deleting `src/models/user.model.js` and creating `src/models/auth.model.js` and `src/models/profile.model.js` to realize the split.

## Complexity Tracking

*No complexity or constitutional gates violated.*
