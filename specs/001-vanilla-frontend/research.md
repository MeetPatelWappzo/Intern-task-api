# Technical Research & Decisions

## Context
The specification explicitly strictly requires a Vanilla HTML/CSS/JS frontend without the use of frameworks such as React, Vue, or Angular. This document tracks technical decisions made to support this architecture.

## Decisions

### 1. API Communication
- **Decision**: Native `fetch` API.
- **Rationale**: Built into all modern browsers. No need to install `axios` or other third-party libraries, satisfying the Vanilla constraint.
- **Alternatives considered**: XMLHttpRequest (outdated, callback-hell), Axios (requires external CDN or bundling).

### 2. State Management
- **Decision**: DOM-based state and closures.
- **Rationale**: Since no frameworks are used, the DOM itself will act as the source of truth for rendered tasks, synchronized with closures in `js/dashboard.js` to manage the list in memory.
- **Alternatives considered**: Redux/MobX (overkill and violates "no framework/heavy library" spirit).

### 3. File Uploads (Profile Image)
- **Decision**: `FormData` API.
- **Rationale**: The specification explicitly mandates `FormData`. It natively handles `multipart/form-data` encoding required for binary file uploads (images) alongside text fields via `fetch`.

### 4. Routing and Protection
- **Decision**: Multi-page Application (MPA) with explicit `window.location.href` redirects.
- **Rationale**: The spec requested separate HTML files (`dashboard.html`, `profile.html`, etc.). A single-page app (SPA) router is unnecessary and adds complexity. Protection is handled by checking `localStorage.getItem('accessToken')` synchronously at the top of protected scripts.
