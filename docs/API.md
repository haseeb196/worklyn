# API.md

## Status

No Server Actions or Route Handlers implemented yet. This document will be
filled in as each one is built (target: Phase 3 onward, domain by domain).

## Documentation format

For every Server Action / Route Handler, record:

```text
Name:
Purpose:
Input:
Validation:
Authorization:
Database operations:
Return value:
Errors:
```

## Planned Server Actions (by domain, to be documented in full when built)

### Clients (Phase 4)
`createClient()`, `updateClient()`, `deleteClient()`

### Projects (Phase 5)
`createProject()`, `updateProject()`, `deleteProject()`

### Tasks (Phase 5)
`createTask()`, `updateTask()`, `deleteTask()`

### Files (Phase 6)
`uploadFile()`, `deleteFile()`, signed-URL retrieval

### Invoices (Phase 7)
`createInvoice()`, `updateInvoice()`, `deleteInvoice()`,
`updateInvoiceStatus()`

### Client Portal (Phase 8)
Client-scoped read actions for project/tasks/files/invoices/comments;
`createComment()`

## Example entry format (to be replicated per action once implemented)

```text
Name: createClient()

Purpose:
Create a new client belonging to the authenticated freelancer.

Input:
name, email, company, phone, website, notes, status

Validation:
Zod schema — required name, valid email format, status enum

Authorization:
Authenticated freelancer only (auth.uid() required)

Database operations:
Insert into clients with user_id = auth.uid()

Return value:
Created client record, or a typed error result

Errors:
Validation error, Unauthorized (no session), Database error
```

*Keep this document updated whenever an API/Server Action changes.*
