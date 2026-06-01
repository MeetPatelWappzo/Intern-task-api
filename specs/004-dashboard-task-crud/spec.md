# Feature Specification: Dashboard & Task CRUD

**Feature Branch**: `004-dashboard-task-crud`  
**Created**: 2026-06-01  
**Status**: Draft  
**Input**: User description: "Create the backend API specification for Phase 3: Dashboard & Task CRUD. This module relies on the JWT Auth middleware from Phase 1 to scope data strictly to the logged-in user. Database Schema (Task): title: String, required. description: String. priority: String, enum: ['epic', 'high', 'medium', 'low'], default: 'medium'. status: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending'. authId: ObjectId referencing the 'Auth' model (ensuring users only access their own tasks). Endpoints (All routes MUST be protected by the JWT verifyToken middleware): POST /api/tasks: Creates a new task linked to the authenticated user's authId. GET /api/tasks: Fetches all tasks belonging to the logged-in user. Must support an optional query parameter ?priority= (e.g., /api/tasks?priority=high) to filter the results. PATCH /api/tasks/:id: Updates general task details (like description or priority). Crucial constraint: Intercept the payload and strictly prevent/ignore updates to the title field. PATCH /api/tasks/:id/status: A dedicated endpoint accepting a JSON body (e.g., {"status": "in-progress"}) to update strictly the execution state of the task"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create Tasks (Priority: P1) 🎯 MVP

As an authenticated user, I want to create a new task with a title, description, and priority so that I can track items I need to complete on my dashboard.

**Why this priority**: Task creation is the baseline operation required for any dashboard task management system.

**Independent Test**: Send a POST request to `/api/tasks` with a valid JWT and a payload containing `title`, `description`, and `priority`. Assert that the task is saved in the database linked to the user's `authId` and returned in the response with a status code of 201.

**Acceptance Scenarios**:

1. **Given** an authenticated user with a valid JWT, **When** they submit a POST request to `/api/tasks` containing a valid `title` and description, **Then** the system MUST save the task linked to their `authId`, defaulting status to `pending`, and return a 201 Created status.
2. **Given** an authenticated user, **When** they submit a POST request without a `title` field, **Then** the system MUST reject the creation and return a 400 Bad Request error.

---

### User Story 2 - Retrieve Tasks with Priority Filtering (Priority: P1)

As an authenticated user, I want to fetch all tasks belonging to me, with the ability to filter them by priority, so that I can manage my work effectively.

**Why this priority**: Retrieving and filtering tasks on the dashboard is essential for planning daily tasks.

**Independent Test**: Send a GET request to `/api/tasks` with a valid JWT. Assert that only the user's tasks are returned. Send a GET request to `/api/tasks?priority=high` and assert that only high-priority tasks are returned.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they make a GET request to `/api/tasks`, **Then** the system MUST return a 200 OK status containing only the tasks associated with their `authId`.
2. **Given** an authenticated user with tasks of varying priorities, **When** they make a GET request to `/api/tasks?priority=high`, **Then** the system MUST return a 200 OK status containing only high-priority tasks belonging to them.

---

### User Story 3 - Update Task Status (Priority: P1)

As an authenticated user, I want to update strictly the execution state (status) of a task so that I can transition tasks from pending to in-progress or completed.

**Why this priority**: Task progress transitions are a core requirement of task lifecycle management.

**Independent Test**: Send a PATCH request to `/api/tasks/:id/status` with `{"status": "in-progress"}` and a valid JWT. Assert that only the status is updated.

**Acceptance Scenarios**:

1. **Given** an authenticated user who owns a specific task, **When** they submit a PATCH request to `/api/tasks/:id/status` with `{"status": "completed"}`, **Then** the system MUST update only the status in the database and return a 200 OK status with the updated task.
2. **Given** an authenticated user who owns a specific task, **When** they submit an invalid status value (e.g. `{"status": "archived"}`), **Then** the system MUST reject the update and return a 400 Bad Request.

---

### User Story 4 - Update General Task Details with Immutable Title (Priority: P2)

As an authenticated user, I want to update task description or priority details without being allowed to change the task's immutable title.

**Why this priority**: Modifying task metadata like description/priority allows task flexibility, while securing the title prevents task definition corruption.

**Independent Test**: Send a PATCH request to `/api/tasks/:id` with new details and a different `title`. Assert that text fields like description update, but the `title` remains unchanged.

**Acceptance Scenarios**:

1. **Given** an authenticated user who owns a specific task, **When** they submit a PATCH request to `/api/tasks/:id` with `{"description": "new desc", "title": "attempted title update"}`, **Then** the system MUST update only the description, completely ignore the title change, and return 200 OK.

---

### Edge Cases

- **Access Control Violation**: If a user attempts to retrieve, update, or change the status of a task belonging to a different user, the system MUST return 404 Not Found (or 403 Forbidden) and protect the other user's data.
- **Non-existent Tasks**: Submitting updates to a non-existent task ID must return a 404 Not Found response.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: All tasks endpoints MUST be protected by the JWT `verifyToken` middleware.
- **FR-002**: The system MUST bind every created task to the logged-in user's `authId` extracted from the JWT.
- **FR-003**: The GET `/api/tasks` endpoint MUST return only tasks owned by the authenticated user.
- **FR-004**: The GET `/api/tasks` endpoint MUST support filtering using an optional `?priority=` query parameter.
- **FR-005**: The PATCH `/api/tasks/:id` endpoint MUST strictly ignore or intercept any modifications to the `title` field, ensuring it remains immutable.
- **FR-006**: The PATCH `/api/tasks/:id/status` endpoint MUST restrict updates strictly to the task's execution state (`status`), rejecting updates to any other fields.
- **FR-007**: The status transitions MUST only accept values: `pending`, `in-progress`, or `completed`.
- **FR-008**: The priority field MUST only accept values: `epic`, `high`, `medium`, or `low`.

### Key Entities

- **Task**: Represents a dashboard item to track.
  - `title`: String, required (immutable after creation).
  - `description`: String.
  - `priority`: Enum: `epic`, `high`, `medium`, `low` (default: `medium`).
  - `status`: Enum: `pending`, `in-progress`, `completed` (default: `pending`).
  - `authId`: ObjectId referencing the `Auth` credentials entity.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of tasks are strictly isolated, ensuring no user can access, read, or modify tasks belonging to other users.
- **SC-002**: 100% of PATCH `/api/tasks/:id` requests attempting to change the task title fail to modify the title in the database.
- **SC-003**: 100% of unauthorized requests are blocked and return 401 Unauthorized.
- **SC-004**: Retrieve dashboard tasks response times average under 100ms.
