# Tasks: Vanilla Frontend

**Input**: Design documents from `/specs/001-vanilla-frontend/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Manual browser testing is required for all flows as specified in `quickstart.md`. No automated tests were explicitly requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 [P] Create `css/` and `js/` directories at the project root

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 [P] Create `js/api.js` exporting `API_BASE_URL` (default to `http://localhost:5002` or Render URL). Include a helper function to retrieve the access token from `localStorage`, and create a reusable `fetchWithAuth` wrapper that automatically injects the `Authorization: Bearer <token>` header.
- [x] T003 [P] Create `css/style.css` with shared variables, typography, navigation bar styling, and base styles for the application.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Authentication (Priority: P1) 🎯 MVP

**Goal**: Users must be able to securely sign up, log in, and manage their active session to access protected features.

**Independent Test**: Can be fully tested by creating a new account, logging in, observing the token stored in localStorage, and successfully logging out.

### Implementation for User Story 1

- [x] T004 [P] [US1] Create `signup.html` at the root with a form capturing name, email, password, and gender (select: `male`, `female`, `other`)
- [x] T005 [P] [US1] Create `login.html` at the root with a form capturing email and password
- [x] T006 [US1] Create `js/auth.js` and implement signup form submission logic hitting `POST /api/auth/signup`, redirecting to `login.html` on success
- [x] T007 [US1] Implement login form submission logic in `js/auth.js` hitting `POST /api/auth/login`, saving the token to `localStorage`, and redirecting to `dashboard.html`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Task Management (Priority: P2)

**Goal**: Users must be able to view, filter, create, and update their daily tasks from a central dashboard.

**Independent Test**: Can be fully tested by an authenticated user creating new tasks, verifying they appear as cards, changing their status, filtering them by priority, and editing task details.

### Implementation for User Story 2

- [x] T008 [P] [US2] Create `dashboard.html` at the root with a main navigation menu (links to Profile and Logout), a layout for tasks, a priority filter dropdown, and a task creation form.
- [x] T009 [P] [US2] Create `css/dashboard.css` to style task cards and the dashboard grid
- [x] T010 [US2] Create `js/dashboard.js`, implement an auth guard (redirect to login if no token), and fetch initial tasks via `GET /api/tasks` using the `fetchWithAuth` helper.
- [x] T011 [US2] Implement task rendering and priority filter (`epic`, `high`, `medium`, `low`) logic in `js/dashboard.js`
- [x] T012 [US2] Implement task creation form submission hitting `POST /api/tasks` in `js/dashboard.js`
- [x] T013 [US2] Implement task status update hitting `PATCH /api/tasks/:id/status` for (`pending`, `in-progress`, `completed`) in `js/dashboard.js`
- [x] T014 [US2] Implement task edit (description, priority) hitting `PATCH /api/tasks/:id` in `js/dashboard.js`, strictly disabling the title input.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Profile Management (Priority: P3)

**Goal**: Users must be able to view and update their personal profile information, including uploading a profile picture.

**Independent Test**: Can be fully tested by an authenticated user navigating to the profile page, viewing their existing data, updating text fields, attaching an image, and saving the changes.

### Implementation for User Story 3

- [x] T015 [P] [US3] Create `profile.html` at the root with a main navigation menu (links to Dashboard and Logout), inputs for `fullName`, `gender`, `address`, `universityName`, `city`, `guardianName`, `guardianPhoneNumber`, `personalMobileNumber`, and a file input for the profile image.
- [x] T016 [P] [US3] Create `css/profile.css` to style the profile page
- [x] T017 [US3] Create `js/profile.js`, implement an auth guard, and fetch `GET /api/profile` (using `fetchWithAuth`) to populate UI fields.
- [x] T018 [US3] Implement profile update hitting `PATCH /api/profile` using `FormData` (multipart/form-data) and `fetchWithAuth` in `js/profile.js`.

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T019 [P] Implement global Logout logic attached to the navigation buttons in `dashboard.html` and `profile.html` that clears `localStorage` and redirects to `login.html`.
- [x] T020 [P] Implement graceful error handling (e.g. 401 Unauthorized redirecting to login, 400 Bad Request showing alerts) across all `.js` files.
- [x] T021 Manual end-to-end browser testing of all flows.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) 
- **User Story 3 (P3)**: Can start after Foundational (Phase 2)

### Parallel Opportunities

- T001 can run immediately.
- T002 and T003 can run in parallel.
- Once Foundation is complete, HTML structures (T004, T005, T008, T015) can all be built in parallel.
- CSS files (T009, T016) can be created in parallel.
- JavaScript logic for each story can be built in parallel by different developers.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Ensure signup, login, and token storage work correctly.

### Incremental Delivery

1. Foundation ready.
2. Add US1 → Test Authentication → MVP!
3. Add US2 → Test Task Management.
4. Add US3 → Test Profile.
5. Add Polish → Logout & global error handling.