# Implementation Plan: Dashboard & Task CRUD

**Branch**: `004-dashboard-task-crud` | **Date**: 2026-06-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-dashboard-task-crud/spec.md`

## Summary

Build task CRUD routing with robust access controls. Tasks are stored in Mongoose under schemas holding reference keys linking to Auth. Endpoints provide querying with optional filters, secure detail updates ignoring title changes, and dedicated status mutations.

## Technical Context

**Language/Version**: Node.js v20.x  
**Primary Dependencies**: Express.js, Mongoose, jsonwebtoken, dotenv  
**Storage**: MongoDB (Mongoose ODM)  
**Testing**: Jest, Supertest  
**Target Platform**: Linux server  
**Project Type**: Single Node.js REST API  
**Performance Goals**: Fetch and query operations under 100ms  
**Constraints**: Scoped user task isolation, immutable title property  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- All API routes MUST be intercepted using JWT validation layers.
- Data queries must strictly append user search filters matching `authId = req.user.id`.

## Project Structure

### Documentation (this feature)

```text
specs/004-dashboard-task-crud/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── tasks.openapi.json
└── checklists/
    └── requirements.md
```

### Source Code Layout

```text
src/
├── controllers/
│   ├── auth.controller.js
│   ├── profile.controller.js
│   └── task.controller.js
├── middleware/
│   ├── auth.middleware.js
│   └── upload.middleware.js
├── models/
│   ├── auth.model.js
│   ├── profile.model.js
│   └── task.model.js
├── routes/
│   ├── auth.routes.js
│   ├── profile.routes.js
│   └── task.routes.js
└── app.js
