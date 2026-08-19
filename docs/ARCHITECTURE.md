# ARCHITECTURE.md

## Status

Not yet implemented. This document will be filled in during and after
Phase 1 (Foundation). The structure below reflects the target architecture
from the project specification.

## High-level architecture

```text
Browser
   ↓
Next.js (App Router)
   ↓
Server Component / Server Action / Route Handler
   ↓
Supabase (SSR client, cookie-based session)
   ↓
PostgreSQL / Storage / Auth
```

## Principles

- Prefer Server Components by default; add `"use client"` only where
  interactivity (forms, dialogs, client-side state) requires it.
- Use Server Actions for mutations where appropriate (create/update/delete
  clients, projects, tasks, invoices).
- Use Route Handlers where a true HTTP endpoint is needed (e.g. webhooks,
  signed download redirects) rather than a Server Action.
- Authorization is never inferred from the UI. Every mutation and every
  data read is scoped by the authenticated user via Supabase RLS — the
  application code does not act as the authorization boundary by itself.
- No separate Express/Node backend. Supabase is the backend.

## Target folder structure

```text
app/
├── (marketing)/        # landing page, pricing
├── (auth)/              # login, signup, forgot-password
├── (dashboard)/         # authenticated freelancer app
│   ├── dashboard/
│   ├── clients/
│   ├── projects/
│   ├── tasks/
│   ├── invoices/
│   ├── files/
│   └── settings/
├── portal/[projectId]/  # authenticated client portal
├── api/                 # route handlers (used sparingly)
└── layout.tsx

components/
├── ui/                  # shadcn primitives
├── layout/              # sidebar, header, mobile-nav
├── dashboard/
├── clients/
├── projects/
├── tasks/
├── invoices/
└── portal/

lib/
├── supabase/            # browser + server client factories
├── validations/         # Zod schemas
├── utils/
└── actions/             # Server Actions grouped by domain

types/
public/
docs/
supabase/
└── migrations/
```

## Authentication flow (planned)

```text
Sign up / Login (Supabase Auth, email+password)
   ↓
Supabase session stored in httpOnly cookies (@supabase/ssr)
   ↓
Server-side Supabase client reads session on every request
   ↓
Middleware / layout-level check redirects unauthenticated users
   away from /dashboard/*, /portal/*
   ↓
RLS enforces per-row access on every query, independent of the above
```

Two account types share the same Supabase Auth system:
- Freelancer accounts (full access to their own data)
- Client accounts (scoped access via `project_members`)

## Data flow example — creating a client

```text
Client form (Client Component, React Hook Form + Zod)
   ↓
Server Action `createClient()`
   ↓
Zod validation (server-side, authoritative)
   ↓
Supabase server client insert, user_id = auth.uid()
   ↓
RLS policy re-validates row ownership at the database level
   ↓
revalidatePath() / redirect
   ↓
Toast success feedback (Sonner)
```

## Architectural decisions log

| Decision | Rationale |
|---|---|
| Supabase over custom backend | Matches spec Section 2; avoids unnecessary infra for an MVP |
| Server Actions over a REST API layer | Fewer moving parts; App Router-native; still validated server-side |
| RLS as the real authorization boundary | Defense in depth — app-layer checks alone are not trusted (spec Section 4) |

*Update this document whenever architecture changes.*
