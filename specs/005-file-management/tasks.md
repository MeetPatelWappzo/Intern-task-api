# Tasks: File Management Module

**Input**: Design documents from `/specs/005-file-management/`
**Prerequisites**: plan.md (required), spec.md (required)

**Tests**: Includes test cases for contract and integration testing.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and routing registration

- [ ] T001 Mount file management routes prefix under `/api/files` in `src/app.js`
- [ ] T002 [P] Verify `swagger-jsdoc` and `swagger-ui-express` packages are correctly configured in `package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core skeletal files that MUST be complete before user stories can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 [P] Create skeleton route handler file in `src/routes/file.routes.js`
- [ ] T004 [P] Create skeleton controller file in `src/controllers/file.controller.js`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Secure single-file image upload (Priority: P1) 🎯 MVP

**Goal**: Authenticated users can upload a JPEG/PNG image up to 2MB to Cloudinary and get the secure URL and public ID.

**Independent Test**: Call POST `/api/files/upload` with a valid JWT token and a sample PNG/JPEG image under 2MB in the `image` field. Expect 200 OK with secure URL and public ID.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T005 [P] [US1] Create integration tests verifying successful upload, invalid file types, size limit rejections, and unauthorized blockings in `tests/integration/file.test.js`
- [ ] T006 [P] [US1] Create contract tests validating returned response structure matches specs in `tests/contract/file.contract.test.js`

### Implementation for User Story 1

- [ ] T007 [US1] Wire JWT `verifyToken` and Multer `upload.single('image')` middleware on `POST /upload` inside `src/routes/file.routes.js`
- [ ] T008 [US1] Implement `uploadFile` handler extracting file buffer and invoking `uploadImageBuffer` in `src/controllers/file.controller.js`
- [ ] T009 [US1] Inject robust error handling for Multer errors (e.g., file size limits) in the route handler of `src/routes/file.routes.js`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Secure file deletion (Priority: P2)

**Goal**: Authenticated users can securely delete uploaded visual assets from Cloudinary using their public ID.

**Independent Test**: Call DELETE `/api/files/delete` with a valid JWT token and a valid Cloudinary `public_id` in the JSON body. Expect 200 OK with success message.

### Tests for User Story 2

- [ ] T010 [P] [US2] Add integration tests verifying successful deletion, missing public_id rejections, and unauthorized blockings in `tests/integration/file.test.js`
- [ ] T011 [P] [US2] Add contract tests validating deletion success response schema in `tests/contract/file.contract.test.js`

### Implementation for User Story 2

- [ ] T012 [P] [US2] Implement a utility helper `deleteImage` invoking `cloudinary.uploader.destroy` in `src/services/cloudinary.service.js`
- [ ] T013 [US2] Implement `deleteFile` controller action extracting `public_id` and calling the helper in `src/controllers/file.controller.js`
- [ ] T014 [US2] Wire the `DELETE /delete` route to `deleteFile` protected by `verifyToken` middleware in `src/routes/file.routes.js`

**Checkpoint**: At this point, both User Stories 1 and 2 work independently.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Documentation and developer workflow experience

- [ ] T015 [P] Document file endpoints with comprehensive interactive JSDoc OpenAPI specs in `src/routes/file.routes.js`
- [ ] T016 Verify file upload interactive elements are working cleanly in Swagger UI at `http://localhost:5000/api/docs`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
- **Polish (Final Phase)**: Depends on all user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories.
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1's Cloudinary structure but can be tested independently.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently via Postman or Curl.
