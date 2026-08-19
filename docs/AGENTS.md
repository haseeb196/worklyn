# AGENTS.md — Instructions for Coding Agents

Project: **Worklyn**

## Stack

- Next.js (App Router, TypeScript)
- Tailwind CSS
- shadcn/ui
- Supabase (PostgreSQL, Auth, Storage, RLS)
- Zod
- React Hook Form
- Recharts
- Vercel

## Core rules

- Read `docs/README.md` before making changes.
- Read `docs/PROJECT_STATUS.md` before starting work, every session.
- Read `docs/ARCHITECTURE.md` before changing architecture.
- Read `docs/DATABASE.md` before changing database code.
- Read `docs/SECURITY.md` before changing authentication, authorization, RLS
  or storage.
- Read `docs/DESIGN_SYSTEM.md` before changing UI.
- Follow the current development phase in `docs/DEVELOPMENT.md`.
- Do not skip phases without explicit user approval.
- Do not build the entire application in one response — work incrementally,
  one phase at a time, and stop for confirmation after each phase.
- Do not expose secrets (service-role keys, API keys, passwords, tokens)
  client-side or in documentation.
- Do not bypass Row Level Security. Never use `using (true)` on
  private-data tables.
- Do not introduce unnecessary dependencies.
- Prefer Server Components; use Client Components only when interactivity
  requires it.
- Validate all server-side mutation inputs with Zod.
- Check authorization for every protected resource — never trust a
  client-provided ID without verifying ownership/access server-side.
- Keep existing working functionality intact; make the smallest reasonable
  change rather than rewriting working code.
- Update documentation in the same change when architecture, database,
  security or major functionality changes (see the maintenance table in
  `docs/PROJECT_STATUS.md`).
- The product name is **Worklyn** only. Never introduce "FreelancerOS" (or
  case variants) into code, UI text, comments, or docs.
- Treat the Stitch designs (`worklyn/DESIGN.md` and the `worklyn_*` screen
  exports) as the visual source of truth. Recreate them accurately in
  Next.js/Tailwind/shadcn — do not redesign or substitute a generic
  dashboard template. If a Stitch design conflicts with a technical/security
  requirement in this spec, keep the technical requirement and preserve the
  Stitch visual direction as closely as possible; explain any deviation.
- Run `npm run check` (lint + typecheck + format check) after meaningful
  changes, before considering a phase complete.
- Never commit secrets, `.env`, `.env.local`, or service-role keys.
- Never force-push or run destructive Git commands without explicit
  instruction.

Add project-specific rules discovered later to this file.
