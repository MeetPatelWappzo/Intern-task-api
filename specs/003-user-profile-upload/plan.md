# Implementation Plan: User Profile & File Upload

**Branch**: `003-user-profile-upload` | **Date**: 2026-06-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-user-profile-upload/spec.md`

## Summary

Build secure GET and PATCH profile endpoints. Users can fetch their custom Profile attributes via their verified JWT token. The profile update endpoint handles multi-part forms, validates file boundaries (strictly JPEG/PNG and under 2MB), uploads images to Cloudinary, and saves text changes transactionally.

## Technical Context

**Language/Version**: Node.js v20.x  
**Primary Dependencies**: Express.js, Mongoose, Multer, Cloudinary, jsonwebtoken, dotenv  
**Storage**: MongoDB (Mongoose ODM) & Cloudinary cloud asset storage  
**Testing**: Jest, Supertest  
**Target Platform**: Linux server  
**Project Type**: Single Node.js REST API  
**Performance Goals**: Fetch profile responses under 100ms  
**Constraints**: Strict 2MB image limit, only .jpg, .jpeg, .png formats allowed  
**Scale/Scope**: REST API endpoint security  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- All architectural designs must align with the Mongoose schemas and single stateless JWT token scheme established in Phase 1.
- Complete mocks must be designed for external file storage APIs during contract and integration tests.

## Project Structure

### Documentation (this feature)

```text
specs/003-user-profile-upload/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── profile.openapi.json
└── checklists/
    └── requirements.md
```

### Source Code Layout

```text
src/
├── config/
│   ├── db.js
│   └── cloudinary.js
├── controllers/
│   ├── auth.controller.js
│   └── profile.controller.js
├── middleware/
│   ├── auth.middleware.js
│   └── upload.middleware.js
├── models/
│   ├── auth.model.js
│   └── profile.model.js
├── routes/
│   ├── auth.routes.js
│   └── profile.routes.js
├── services/
│   └── cloudinary.service.js
└── app.js

tests/
├── contract/
│   ├── auth.contract.test.js
│   └── profile.contract.test.js
├── integration/
│   ├── auth.test.js
│   └── profile.test.js
└── unit/
    └── auth.middleware.test.js
```

**Structure Decision**: Standard single project directory structure mounting clean MVC routes, services, and schemas.
