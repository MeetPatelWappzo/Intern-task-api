# Feature Specification: Vanilla Frontend

**Feature Branch**: `001-vanilla-frontend`  
**Created**: 2026-06-03  
**Status**: Draft  

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Authentication (Priority: P1)

Users must be able to securely sign up, log in, and manage their active session to access protected features.

**Why this priority**: Without authentication, users cannot securely access their private tasks and profile. It is the fundamental prerequisite for the rest of the application.

**Independent Test**: Can be fully tested by creating a new account, logging in, observing the token stored in localStorage, and successfully logging out.

**Acceptance Scenarios**:

1. **Given** a new user on the signup page, **When** they submit valid registration details (name, email, password, gender), **Then** their account is created and they are redirected to the login page.
2. **Given** a registered user on the login page, **When** they submit valid credentials, **Then** an access token is saved to localStorage and they are redirected to the dashboard.
3. **Given** an authenticated user on the dashboard, **When** they click "Logout", **Then** the access token is cleared from localStorage and they are redirected to the login page.
4. **Given** an unauthenticated user, **When** they attempt to directly access the dashboard or profile page, **Then** they are redirected back to the login page.

---

### User Story 2 - Task Management (Priority: P2)

Users must be able to view, filter, create, and update their daily tasks from a central dashboard.

**Why this priority**: Task management is the core functionality of the Daily Task Tracker API.

**Independent Test**: Can be fully tested by an authenticated user creating new tasks, verifying they appear as cards, changing their status, filtering them by priority, and editing task details.

**Acceptance Scenarios**:

1. **Given** an authenticated user on the dashboard, **When** the page loads, **Then** their tasks are fetched from the API and rendered as cards.
2. **Given** an authenticated user on the dashboard, **When** they submit the "Create Task" form with a title, description, and priority, **Then** a new task is created and added to the dashboard.
3. **Given** a user viewing their tasks, **When** they change a task's status, **Then** the status is updated via the API and reflected on the UI.
4. **Given** a user viewing their tasks, **When** they edit a task, **Then** they can update the description and priority, but the title field is disabled/read-only.
5. **Given** a user viewing multiple tasks, **When** they select a specific priority from the filter dropdown, **Then** only tasks matching that priority are displayed.

---

### User Story 3 - Profile Management (Priority: P3)

Users must be able to view and update their personal profile information, including uploading a profile picture.

**Why this priority**: Personalization enhances user experience, though it is not strictly required for the core task tracking flow.

**Independent Test**: Can be fully tested by an authenticated user navigating to the profile page, viewing their existing data, updating text fields, attaching an image, and saving the changes.

**Acceptance Scenarios**:

1. **Given** an authenticated user on the profile page, **When** the page loads, **Then** their current profile information is fetched and populated into the UI.
2. **Given** an authenticated user, **When** they submit the profile update form with text changes and a new image file, **Then** the updates are sent to the API using multipart form data and the UI reflects the saved changes.

---

### Edge Cases

- What happens when the user's access token expires while they are on the dashboard?
- How does the system handle failed API requests (e.g., 400 Bad Request on signup, 401 Unauthorized on API calls)?
- What happens if the user tries to upload an unsupported file type or excessively large image on the profile page?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a user registration page (`signup.html`) that captures name, email, password, and gender (via a select dropdown: `male`, `female`, `other`).
- **FR-002**: The system MUST provide a login page (`login.html`) that authenticates users. On success, it MUST store the access token in `localStorage`.
- **FR-003**: The system MUST provide a dashboard page (`dashboard.html`) that verifies the presence of an access token on load and redirects to login if absent.
- **FR-004**: The system MUST include a utility script (`js/api.js`) that exports a configurable base API URL constant (e.g., `http://localhost:5002` or the live Render URL) and provides a helper function to retrieve the access token from `localStorage`.
- **FR-005**: The system MUST fetch tasks using GET `/api/tasks` with the token in the `Authorization: Bearer` header, and render them as cards on the dashboard.
- **FR-006**: The system MUST allow users to filter tasks on the dashboard by priority (`epic`, `high`, `medium`, `low`) using a dropdown.
- **FR-007**: The system MUST provide a form on the dashboard to create new tasks via POST `/api/tasks` (accepting title, description, and priority).
- **FR-008**: The system MUST allow users to update the status (`pending`, `in-progress`, `completed`) of existing tasks via PATCH `/api/tasks/:id/status`.
- **FR-009**: The system MUST allow users to edit general task details (description, priority) via PATCH `/api/tasks/:id`. The `title` field MUST be strictly disabled/read-only in the UI during edits.
- **FR-010**: The system MUST provide a profile page (`profile.html`) that fetches the current user's profile via GET `/api/profile` and populates a form.
- **FR-011**: The system MUST allow users to update their full profile and upload a profile image via PATCH `/api/profile`, explicitly using `FormData` (multipart/form-data). The form MUST include inputs for: `fullName`, `gender`, `address`, `universityName`, `city`, `guardianName`, `guardianPhoneNumber`, and `personalMobileNumber`.
- **FR-012**: The system MUST include a "Logout" button on protected pages that clears `localStorage` entirely and redirects to the login page.
- **FR-013**: The system MUST NOT use any frontend frameworks (e.g., React, Vue, Angular); it MUST be built entirely with Vanilla HTML, CSS, and JavaScript.
- **FR-014**: The system architecture MUST adhere to the specified structure: HTML files at the root, styles in a `css/` folder, and scripts in a `js/` folder.

### Key Entities

- **User**: Represents the authenticated person using the application. Contains attributes linked to the Auth and Profile models: email, fullName, gender, profileUrl, address, universityName, city, guardianName, guardianPhoneNumber, and personalMobileNumber.
- **Task**: Represents a daily activity to be tracked. Contains attributes: title, description, priority (`epic`, `high`, `medium`, `low`), and status (`pending`, `in-progress`, `completed`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully register, log in, and be redirected to the dashboard.
- **SC-002**: Unauthenticated access attempts to `dashboard.html` or `profile.html` instantly redirect the user to `login.html`.
- **SC-003**: Users can create a task, edit its description/priority, update its status, and filter the task list accurately without page reloads (client-side dynamic rendering).
- **SC-004**: Profile updates (including image uploads and all specific fields) succeed via `FormData` and correctly reflect the newly uploaded image.
- **SC-005**: The codebase structure strictly adheres to the requested Vanilla JS architecture, verified by code inspection.