# DATABASE.md

## Status

Not yet implemented (target for Phase 2 — Database & Security). This
document describes the planned schema per the project specification and
will be updated to match the real, deployed schema as soon as Phase 2 lands.

## Relationship overview

```text
auth.users
   │
   └── profiles (1:1)
          │
          └── clients (1:many, owned by freelancer)
                 │
                 └── projects (1:many)
                        ├── tasks (1:many)
                        ├── files (1:many)
                        ├── comments (1:many)
                        └── project_members (1:many → clients, portal access)

profiles
   └── invoices (1:many)
          ├── invoice_items (1:many)
          ├── client_id → clients
          └── project_id → projects (optional)
```

## Tables (planned)

### profiles
Freelancer/user profile, 1:1 with `auth.users`.
- `id` (uuid, PK, references `auth.users.id`)
- `full_name`, `avatar_url`, `email`, `company_name`
- `created_at`, `updated_at`

### clients
- `id`, `user_id` (owner, references `auth.users.id`)
- `name`, `email`, `company`, `phone`, `website`, `avatar_url`, `notes`
- `status`: `active` | `inactive`
- `created_at`, `updated_at`

### projects
- `id`, `user_id` (owner), `client_id`
- `name`, `description`
- `status`: `planning` | `active` | `on_hold` | `completed` | `cancelled`
- `start_date`, `due_date`, `budget`, `progress`
- `created_at`, `updated_at`

### tasks
- `id`, `project_id`, `user_id`
- `title`, `description`
- `status`: `todo` | `in_progress` | `review` | `completed`
- `priority`: `low` | `medium` | `high` | `urgent`
- `due_date`, `assigned_to` (defaults to the owning freelancer in V1; no
  team-management functionality in V1 — field exists for future-proofing)
- `created_at`, `updated_at`

### invoices
- `id`, `user_id`, `client_id`, `project_id` (optional)
- `invoice_number`
- `status`: `draft` | `sent` | `paid` | `overdue` | `cancelled`
- `issue_date`, `due_date`
- `subtotal`, `tax`, `total`
- `currency` — **per-invoice**, not global. Worklyn supports multiple
  currencies; each invoice records its own currency code (e.g. ISO 4217).
- `notes`
- `created_at`, `updated_at`

### invoice_items
- `id`, `invoice_id`
- `description`, `quantity`, `unit_price`, `amount`
- `created_at`

### files
- `id`, `user_id`, `project_id`, `uploaded_by`
- `name`, `storage_path`, `file_size`, `mime_type`
- `created_at`
- Actual binary content lives in Supabase Storage (bucket
  `project-files`); this table stores metadata only. Max file size 10 MB
  (V1 default), implemented as a configurable constant, not hardcoded in
  multiple places.

### project_members
Grants a client account access to a specific project (client portal
authorization).
- `id`, `project_id`, `client_id`
- `role`: `client` (only role in V1)
- `created_at`

### comments
Can belong to a project or a task (one of `project_id`/`task_id` set).
- `id`, `project_id`, `task_id`, `user_id`, `client_id`
- `content`
- `created_at`, `updated_at`

## Relationships & constraints (planned)

- A client can have multiple projects; a project belongs to exactly one
  client.
- A project can contain many tasks/files/comments.
- An invoice belongs to a client and optionally a project.
- All owner-scoped tables carry a `user_id` (or resolve to one via a
  parent) so RLS can enforce "owner only" access.
- Client-portal access is never inferred from `clients.user_id` directly —
  it is always mediated through `project_members`, so a client only ever
  sees projects explicitly shared with them.

## RLS policies

Documented in detail in `docs/SECURITY.md` once implemented. Conceptually,
every table above will have RLS enabled with policies scoped to
`auth.uid()` (freelancer) or to `project_members` membership (client).
No table uses a `using (true)` policy for private data.

## Indexes (planned)

- Foreign key columns (`user_id`, `client_id`, `project_id`, `task_id`,
  `invoice_id`) will be indexed to support common list/filter queries.
- Composite index candidates: `(project_id, status)` on `tasks`,
  `(user_id, status)` on `invoices`.

*This file must be updated in the same change as any schema migration.
Do not let it go stale.*
