# Technical Research: Task CRUD Security & Scope

## Decision: Multi-Tenant Data Isolation Strategy
- **Chosen Option**: Implicit Filter Injection (`{ authId: req.user.id }` appended on every query).
- **Rationale**: By enforcing this query criteria natively in all database queries, it is impossible for a user to query or mutate another user's task details even if they intercept and send foreign task ObjectIds.
- **Alternatives Considered**: Explicit check after query (fetch task, assert `task.authId === user.id`). Rejected because it leads to redundant database I/O roundtrips.

## Decision: Immutable Property Implementation
- **Chosen Option**: Destructuring Payload Interception (`const { title, ...updates } = req.body;`).
- **Rationale**: Isolates text field properties cleanly at controller layers. Any title modifications submitted by users are completely skipped before updates are committed, making it elegant and simple.
