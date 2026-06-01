<!--
### Sync Impact Report
- **Version Change**: None -> v1.0.0 (Initial Ratification)
- **Modified Principles**: None (Initial Setup)
- **Added Sections**:
  - Preamble
  - Core Principles (Principle 1: Technology Stack, Principle 2: RESTful API Design, Principle 3: JSDoc & Swagger Documentation, Principle 4: Media Uploads & Security, Principle 5: Code Simplicity & Frontend Readability)
  - Governance & Process
- **Templates Requiring Updates**:
  - .specify/templates/plan-template.md (✅ updated)
  - .specify/templates/spec-template.md (✅ updated)
  - .specify/templates/tasks-template.md (✅ updated)
- **Follow-up TODOs**: None
-->

# Project Constitution: intern-task-api

## Metadata
- **Constitution Version**: 1.0.0
- **Ratification Date**: 2026-06-01
- **Last Amended Date**: 2026-06-01

## Preamble
This Constitution serves as the ultimate source of law and engineering standards for the intern-task-api project. All designs, specifications, tasks, and code implementations MUST strictly comply with the principles laid out in this document. Any deviation is considered a high-severity non-compliance issue.

## Core Principles

### Principle 1: Technology Stack & Standards
- **Statement**: The application MUST be built using Node.js with **Express.js** as the web framework, **MongoDB** with **Mongoose** as the Object Document Mapper (ODM), **Multer** for multipart form-data handling, **Cloudinary** for image cloud storage, and **JSON Web Tokens (JWT)** for stateless user authentication.
- **Rationale**: Standardizes the backend environment to ensure predictable performance, solid ODM schema control, secure data persistence, offloaded asset management, and scalable authentication.
- **Verification**: Codebase inspections and package.json validation MUST confirm only these approved dependencies are used for core functionalities.

### Principle 2: RESTful API Design
- **Statement**: All API endpoints MUST adhere strictly to RESTful design patterns. Endpoints MUST use pluralized nouns for resources (e.g., `/api/tasks`), appropriate HTTP methods (`GET`, `POST`, `PUT`, `DELETE`), and standard HTTP response status codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`).
- **Rationale**: Ensures predictability, ease of integration, and standardized API consumers' experience.
- **Verification**: API routing declarations and manual/automated endpoint sweeps MUST verify strict REST compliance.

### Principle 3: JSDoc & Swagger Documentation
- **Statement**: Every API endpoint and controller handler MUST include detailed **JSDoc comments** that map directly to the OpenAPI specification. These comments MUST cover the description, HTTP method, parameters, request body, and all possible response formats.
- **Rationale**: Enables automatic, accurate Swagger UI documentation generation, ensuring the API documentation never drifts from the actual code.
- **Verification**: CI pipeline or static analysis step MUST run Swagger generation tools and verify JSDoc coverage.

### Principle 4: Media Uploads & Security
- **Statement**: All image uploads handled via Multer and Cloudinary MUST strictly enforce a maximum file size limit of **2MB**. Any upload exceeding 2MB MUST be rejected immediately at the Multer middleware level before hitting the application controllers or Cloudinary upload flows.
- **Rationale**: Protects server bandwidth, storage capacity, and Cloudinary quotas from abuse, while preventing potential denial-of-service (DoS) attempts via oversized payloads.
- **Verification**: Integration tests MUST verify that payloads larger than 2MB receive a `400 Bad Request` or `413 Payload Too Large` error.

### Principle 5: Code Simplicity & Frontend Readability
- **Statement**: The backend code structure and response schemas MUST be kept exceptionally simple, clean, and intuitive. Avoid overly complex abstraction layers, multi-nested design patterns, or highly esoteric code syntax, specifically to ensure that frontend developers can easily read, comprehend, and integrate with the backend API.
- **Rationale**: Promotes collaboration, speeds up frontend-backend integration, and facilitates straightforward troubleshooting.
- **Verification**: Peer code reviews and modular structures MUST confirm that architectural complexity remains low and readable.

## Governance & Process
1. **Amendments**: Any change to this Constitution requires a minor or major version bump. Minor updates (v1.1.0) cover additions of optional patterns, whereas major updates (v2.0.0) cover changes to core technology stacks or rules.
2. **Compliance**: Every technical plan (`plan.md`) MUST include a "Constitution Check" verifying alignment with these five core principles.
3. **Enforcement**: Static analysis (`speckit.checker`) and code reviews (`speckit.reviewer`) will flag any code violating these principles as blocking issues.
