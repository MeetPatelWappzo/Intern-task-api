# Quickstart Guide: Dashboard & Task CRUD Integrations

Quick guide to interacting with the Dashboard Task endpoints.

## 1. Create a Task
- **POST `/api/tasks`**
- **Headers**: `Authorization: Bearer <accessToken>`
- **Payload**:
  ```json
  {
    "title": "Design Plan",
    "description": "Establish Phase 3 components",
    "priority": "high"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "id": "65b5974c5d5e5e4078cb8db3",
    "authId": "65b5974c5d5e5e4078cb8db1",
    "title": "Design Plan",
    "description": "Establish Phase 3 components",
    "priority": "high",
    "status": "pending"
  }
  ```

---

## 2. Retrieve Dashboard Tasks (With Filter)
- **GET `/api/tasks?priority=high`**
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response (200 OK)**:
  ```json
  [
    {
      "id": "65b5974c5d5e5e4078cb8db3",
      "authId": "65b5974c5d5e5e4078cb8db1",
      "title": "Design Plan",
      "description": "Establish Phase 3 components",
      "priority": "high",
      "status": "pending"
    }
  ]
  ```

---

## 3. General Updates (Immutable Title)
- **PATCH `/api/tasks/65b5974c5d5e5e4078cb8db3`**
- **Headers**: `Authorization: Bearer <accessToken>`
- **Payload**:
  ```json
  {
    "description": "Updated detail description",
    "title": "Attempted Title Hack"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "id": "65b5974c5d5e5e4078cb8db3",
    "authId": "65b5974c5d5e5e4078cb8db1",
    "title": "Design Plan", 
    "description": "Updated detail description",
    "priority": "high",
    "status": "pending"
  }
  ```
  *(Note: The title field remains unchanged!)*

---

## 4. Specific Status Transition
- **PATCH `/api/tasks/65b5974c5d5e5e4078cb8db3/status`**
- **Headers**: `Authorization: Bearer <accessToken>`
- **Payload**:
  ```json
  {
    "status": "in-progress"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "id": "65b5974c5d5e5e4078cb8db3",
    "authId": "65b5974c5d5e5e4078cb8db1",
    "title": "Design Plan",
    "description": "Updated detail description",
    "priority": "high",
    "status": "in-progress"
  }
  ```
