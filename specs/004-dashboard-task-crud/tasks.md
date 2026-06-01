# Tasks: Dashboard & Task CRUD

**Input**: Design documents from `/specs/004-dashboard-task-crud/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

*(No additional setup required - utilizes the established Express app environment)*

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T001 Define Mongoose Task schema in [src/models/task.model.js](file:///d:/Meet%20Patel/Personal/intern-task-api/src/models/task.model.js)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create Tasks (Priority: P1) 🎯 MVP

**Goal**: Allow authenticated users to create new tasks linked to their unique authId.

**Independent Test**: POST request to `/api/tasks` returning 201 Created and the created task details.

### Tests for User Story 1
- [x] T002 [P] [US1] Create integration test for task creation in [tests/integration/task.test.js](file:///d:/Meet%20Patel/Personal/intern-task-api/tests/integration/task.test.js)
- [x] T003 [P] [US1] Create contract test for POST /api/tasks in [tests/contract/task.contract.test.js](file:///d:/Meet%20Patel/Personal/intern-task-api/tests/contract/task.contract.test.js)

### Implementation for User Story 1
- [x] T004 [US1] Implement createTask controller handler in [src/controllers/task.controller.js](file:///d:/Meet%20Patel/Personal/intern-task-api/src/controllers/task.controller.js)
- [x] T005 [US1] Mount POST /api/tasks route in [src/routes/task.routes.js](file:///d:/Meet%20Patel/Personal/intern-task-api/src/routes/task.routes.js)
- [x] T006 [US1] Register task routes in [src/app.js](file:///d:/Meet%20Patel/Personal/intern-task-api/src/app.js)

**Checkpoint**: User Story 1 is functional and testable independently.

---

## Phase 4: User Story 2 - Retrieve Tasks with Priority Filtering (Priority: P1)

**Goal**: Retrieve tasks belonging strictly to the authenticated user, supporting priority queries.

**Independent Test**: GET request to `/api/tasks` returning 200 OK along with filtering checks.

### Tests for User Story 2
- [x] T007 [P] [US2] Create integration test for task retrieval and priority filtering in [tests/integration/task.test.js](file:///d:/Meet%20Patel/Personal/intern-task-api/tests/integration/task.test.js)
- [x] T008 [P] [US2] Create contract test for GET /api/tasks in [tests/contract/task.contract.test.js](file:///d:/Meet%20Patel/Personal/intern-task-api/tests/contract/task.contract.test.js)

### Implementation for User Story 2
- [x] T009 [US2] Implement getTasks controller handler in [src/controllers/task.controller.js](file:///d:/Meet%20Patel/Personal/intern-task-api/src/controllers/task.controller.js)
- [x] T010 [US2] Mount GET /api/tasks route in [src/routes/task.routes.js](file:///d:/Meet%20Patel/Personal/intern-task-api/src/routes/task.routes.js)

**Checkpoint**: User Story 2 is functional and testable.

---

## Phase 5: User Story 3 - Update Task Status (Priority: P1)

**Goal**: Provide a dedicated endpoint to update strictly the execution state (status) of a task.

**Independent Test**: PATCH request to `/api/tasks/:id/status` updating strictly the status field.

### Tests for User Story 3
- [x] T011 [P] [US3] Create integration test for task status updates in [tests/integration/task.test.js](file:///d:/Meet%20Patel/Personal/intern-task-api/tests/integration/task.test.js)
- [x] T012 [P] [US3] Create contract test for PATCH /api/tasks/:id/status in [tests/contract/task.contract.test.js](file:///d:/Meet%20Patel/Personal/intern-task-api/tests/contract/task.contract.test.js)

### Implementation for User Story 3
- [x] T013 [US3] Implement updateTaskStatus controller handler in [src/controllers/task.controller.js](file:///d:/Meet%20Patel/Personal/intern-task-api/src/controllers/task.controller.js)
- [x] T014 [US3] Mount PATCH /api/tasks/:id/status route in [src/routes/task.routes.js](file:///d:/Meet%20Patel/Personal/intern-task-api/src/routes/task.routes.js)

**Checkpoint**: Task status operations are functional.

---

## Phase 6: User Story 4 - Update General Task Details with Immutable Title (Priority: P2)

**Goal**: Update general details of a task while strictly preventing or ignoring edits to the title field.

**Independent Test**: PATCH request to `/api/tasks/:id` updating details but ignoring title fields.

### Tests for User Story 4
- [x] T015 [P] [US4] Create integration test for general updates and title immutability in [tests/integration/task.test.js](file:///d:/Meet%20Patel/Personal/intern-task-api/tests/integration/task.test.js)
- [x] T016 [P] [US4] Create contract test for PATCH /api/tasks/:id in [tests/contract/task.contract.test.js](file:///d:/Meet%20Patel/Personal/intern-task-api/tests/contract/task.contract.test.js)

### Implementation for User Story 4
- [x] T017 [US4] Implement updateTask controller handler in [src/controllers/task.controller.js](file:///d:/Meet%20Patel/Personal/intern-task-api/src/controllers/task.controller.js)
- [x] T018 [US4] Mount PATCH /api/tasks/:id route in [src/routes/task.routes.js](file:///d:/Meet%20Patel/Personal/intern-task-api/src/routes/task.routes.js)

**Checkpoint**: Task general details operations are functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T019 Execute complete Jest test suite and confirm all assertions pass
