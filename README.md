# Worklyn

## Project overview

Worklyn is a client/project management SaaS platform for freelancers and small
agencies. It lets a freelancer manage clients, projects, tasks, files and
invoices in one place, and gives each client a dedicated, authenticated portal
to view the progress, files and invoices shared with them.

## Current stack

- Next.js (latest stable, App Router, TypeScript)
- Tailwind CSS
- shadcn/ui
- Lucide icons
- Supabase (PostgreSQL, Auth, Storage, Row Level Security)
- Zod, React Hook Form
- Recharts
- date-fns
- Sonner
- Vercel (deployment target)

## Current status

```text
Current Phase: Not started
Completed:
- (none yet)

Currently working on:
- Phase 1 — Foundation (pending user confirmation to begin)

Next:
- Phase 2 — Database & Security
```

See `docs/PROJECT_STATUS.md` for the live, detailed status.

## Important documents

```text
AGENTS.md
→ Rules every coding agent must follow on this project

ARCHITECTURE.md
→ Application architecture and folder structure

DATABASE.md
→ Database schema, relationships and queries

SECURITY.md
→ Authentication, authorization, RLS and storage security

DESIGN_SYSTEM.md
→ UI rules and Stitch-to-code implementation rules

DEVELOPMENT.md
→ Development workflow, phase rules and phase tracking

API.md
→ Server Actions, Route Handlers and API behavior

PROJECT_STATUS.md
→ Current implementation status (read this first, every session)
```

## Getting started

```bash
npm install
npm run dev
```

Environment variables are documented (names only, never values) in
`.env.example` at the project root and in `docs/SECURITY.md`. Never commit
real credentials.

