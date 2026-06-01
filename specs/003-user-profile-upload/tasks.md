# Tasks: User Profile & File Upload

**Input**: Design documents from `/specs/003-user-profile-upload/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Configure environment placeholders in [.env.example](file:///d:/Meet%20Patel/Personal/intern-task-api/.env.example)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Implement Cloudinary API configuration in [src/config/cloudinary.js](file:///d:/Meet%20Patel/Personal/intern-task-api/src/config/cloudinary.js)
- [x] T003 Implement Cloudinary helper service in [src/services/cloudinary.service.js](file:///d:/Meet%20Patel/Personal/intern-task-api/src/services/cloudinary.service.js)
- [x] T004 Refine Multer image upload filter constraints in [src/middleware/upload.middleware.js](file:///d:/Meet%20Patel/Personal/intern-task-api/src/middleware/upload.middleware.js)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Retrieve Profile Information (Priority: P1) 🎯 MVP

**Goal**: Fetch user profile attributes by authenticated user authId.

**Independent Test**: GET request to `/api/profile` returning profile fields under valid JWT.

### Tests for User Story 1
- [x] T005 [P] [US1] Create integration test for profile retrieval in [tests/integration/profile.test.js](file:///d:/Meet%20Patel/Personal/intern-task-api/tests/integration/profile.test.js)
- [x] T006 [P] [US1] Create contract test for GET /api/profile in [tests/contract/profile.contract.test.js](file:///d:/Meet%20Patel/Personal/intern-task-api/tests/contract/profile.contract.test.js)

### Implementation for User Story 1
- [x] T007 [US1] Implement getProfile handler in [src/controllers/profile.controller.js](file:///d:/Meet%20Patel/Personal/intern-task-api/src/controllers/profile.controller.js)
- [x] T008 [US1] Mount GET /api/profile route in [src/routes/profile.routes.js](file:///d:/Meet%20Patel/Personal/intern-task-api/src/routes/profile.routes.js)
- [x] T009 [US1] Register profile routes at `/api/profile` in [src/app.js](file:///d:/Meet%20Patel/Personal/intern-task-api/src/app.js)

**Checkpoint**: User Story 1 is functional and testable independently.

---

## Phase 4: User Story 2 - Update Profile Details and Avatar (Priority: P2)

**Goal**: Update text details and stream images directly to Cloudinary.

**Independent Test**: PATCH request to `/api/profile` uploading files and updating records.

### Tests for User Story 2
- [x] T010 [P] [US2] Create integration test for profile updates and file filter in [tests/integration/profile.test.js](file:///d:/Meet%20Patel/Personal/intern-task-api/tests/integration/profile.test.js)
- [x] T011 [P] [US2] Create contract test for PATCH /api/profile in [tests/contract/profile.contract.test.js](file:///d:/Meet%20Patel/Personal/intern-task-api/tests/contract/profile.contract.test.js)

### Implementation for User Story 2
- [x] T012 [US2] Implement updateProfile handler in [src/controllers/profile.controller.js](file:///d:/Meet%20Patel/Personal/intern-task-api/src/controllers/profile.controller.js)
- [x] T013 [US2] Mount PATCH /api/profile route in [src/routes/profile.routes.js](file:///d:/Meet%20Patel/Personal/intern-task-api/src/routes/profile.routes.js)

**Checkpoint**: User Stories 1 and 2 work independently.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T014 Execute complete Jest test suite and confirm all assertions pass
