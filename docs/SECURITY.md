# SECURITY.md

## Status

Not yet implemented (target: Phase 1 for auth foundation, Phase 2 for RLS,
Phase 6 for storage security). This document records the security model
this project must follow and will be updated with concrete policy names
once implemented.

## Authentication

- Supabase Auth, email + password, for both freelancer and client accounts.
- Session handling via `@supabase/ssr`, cookie-based, read on both server
  and client.
- Password reset uses Supabase Auth's standard email-based reset flow — no
  custom authentication system.
- Protected routes (`/dashboard/*`, `/clients`, `/projects`, `/tasks`,
  `/invoices`, `/files`, `/settings`, `/portal/*`) redirect unauthenticated
  users to `/login`.

## Authorization model

Two account types, same Supabase Auth system, different access shape:

### Freelancer
Full CRUD over their own clients, projects, tasks, invoices, files.
Freelancer permissions never extend to another freelancer's data.

### Client
- Client accounts authenticate the same way (email + Supabase Auth).
- A client can only access a project if a matching row exists in
  `project_members` (`project_id`, `client_id`).
- Within an accessible project, a client may: view project overview,
  tasks, files, invoices, and comment. Clients cannot edit tasks, delete
  data, or see other clients/projects/freelancer analytics/private notes.
- No team-management permissions in V1 — client role is fixed to `client`.

## Row Level Security

RLS is enabled on every application table (Section 8 of the spec). No
table may use a private-data policy of `using (true)`.

Conceptual policy set (to be implemented and documented here with real
policy names/SQL once Phase 2 lands):

```text
profiles          — user can select/update only their own row
clients           — user can access rows where clients.user_id = auth.uid()
projects          — user can access rows where projects.user_id = auth.uid()
                     OR auth.uid() maps to a client in project_members
tasks             — access follows the parent project's policy
files             — access follows the parent project's policy
invoices          — freelancer: user_id = auth.uid()
                     client: invoices.client_id maps to their client row
                     AND they have project_members access where applicable
comments          — access follows the parent project/task's policy
project_members   — freelancer (project owner) can manage;
                     client can read only their own membership row
```

Authorization is enforced at the database level, not just in application
code — a manually altered client request must not be able to cross a user
boundary.

## Storage

- Bucket: `project-files`.
- Suggested path convention: `user_id/project_id/file-name`.
- Files are private by default; access via authenticated requests / signed
  URLs, not public URLs.
- Max upload size: 10 MB (V1 default), implemented as a single
  configurable constant so it can be changed later without hunting through
  the codebase.
- Allowed types: PDF, PNG, JPG, WEBP, DOCX, XLSX, ZIP.
- Storage policies mirror the `files` table RLS: a client can only read
  files belonging to a project they are a member of.

## Secrets

Required environment variables (names only — real values live in
`.env.local` / Vercel project settings, never in this repo or docs):

```text
NEXT_PUBLIC_SUPABASE_URL          — public, safe for client
NEXT_PUBLIC_SUPABASE_ANON_KEY     — public, safe for client (RLS-protected)
SUPABASE_SERVICE_ROLE_KEY         — server-only, never sent to the browser
```

Never commit `.env`, `.env.local`, `.env.production`, or any file
containing real credentials. `.env.example` at the project root lists
variable names only.

## Open items

To be finalized during Phase 2/6 implementation and documented here:
- Exact RLS policy SQL per table.
- Signed URL expiry duration for file downloads.
- Rate limiting / abuse prevention for auth endpoints (if added later).

*Update this document in the same change as any auth, authorization, RLS,
or storage-policy change.*
