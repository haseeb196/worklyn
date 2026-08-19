# DEVELOPMENT.md

## Phase-based development — mandatory

This project is built strictly in phases. Do not generate the entire
application at once. Each phase must be implemented, checked, explained,
and confirmed by the user before the next phase begins — even if a prior
agent/session already made progress.

Per-phase workflow:

```text
1. Explain the objective of the phase
2. Explain what will be built
3. List files to be created/modified
4. Implement only that phase
5. Run npm run check (and npm run build where relevant)
6. Fix errors
7. Explain what was implemented
8. Tell the user how to test it
9. Wait for confirmation before starting the next phase
```

Do not silently skip phases. Do not start Phase N+1 automatically after
finishing Phase N.

## Phases

### Phase 1 — Foundation
**Status: Complete**
Next.js, TypeScript, Tailwind v4, Lucide, Supabase browser/server/proxy
clients, environment variable scaffolding, authentication foundation
(login/signup/forgot-reset password via Server Actions), basic app
layout, Stitch-based navigation/sidebar/mobile-nav. Git + Husky +
lint-staged + GitHub Actions CI configured. `npm run check` and `npm run
build` pass cleanly. No full dashboard functionality yet — that's
Phase 3. Real Supabase project connection is still pending (user to
create project and supply credentials for Phase 2).

### Phase 2 — Database & Security
**Status: Not started**
Schema, relationships, indexes, RLS policies, storage configuration,
generated types, seed/demo data. Verify one user cannot access another's
data before moving on.

### Phase 3 — Dashboard
**Status: Not started**
Layout, statistics, revenue chart, active projects, upcoming tasks, recent
activity. Stitch dashboard screens as visual reference.

### Phase 4 — Clients
**Status: Not started**
List, search, filter, add/edit/delete, detail page, related
projects/invoices.

### Phase 5 — Projects & Tasks
**Status: Not started**
Project CRUD, detail, status, progress, deadlines; task CRUD, status,
priority.

### Phase 6 — Files
**Status: Not started**
Supabase Storage integration, upload, list, download/access, delete,
permissions, loading/error states. Verify private files aren't accessible
to unauthorized users.

### Phase 7 — Invoices
**Status: Not started**
Creation, editing, deletion, line items, automatic calculations, detail,
status management, preview. No real payment processing.

### Phase 8 — Client Portal
**Status: Not started**
Client auth/access, project overview, progress, tasks, files, invoices,
comments/activity. Verify a client only ever sees explicitly shared
projects.

### Phase 9 — Polish & Quality
**Status: Not started**
Loading/empty/error/success states, responsive layouts, mobile nav,
accessibility, form validation, visual consistency vs Stitch, subtle
animation, SEO, performance.

### Phase 10 — Production
**Status: Not started**
GitHub repo, production Supabase config, Vercel deployment, env vars,
production DB/auth/storage, final build & full-flow test.

## Local quality checks

```bash
npm run dev
npm run lint
npm run typecheck
npm run format:check
npm run check        # lint + typecheck + format:check
npm run build         # production build
```

Run `npm run check` after meaningful changes, before considering a phase
complete.

## Git workflow (Sections 48–61 of the spec)

- Husky + lint-staged run ESLint/Prettier on staged files pre-commit.
- GitHub Actions (`.github/workflows/ci.yml`) runs install → lint →
  typecheck → format check → build on PRs and pushes to `main`.
- Conventional commit messages (`feat:`, `fix:`, `refactor:`, `docs:`,
  `style:`, `chore:`).
- Feature branches for non-trivial work (`feature/...`, `fix/...`,
  `chore/...`); merge only after checks pass. Keep it simple for a solo
  project — no unnecessary process overhead.
- Database schema changes are committed as Supabase migrations
  (`supabase/migrations/`) alongside the related code and doc updates,
  never left as undocumented manual dashboard changes.
- Never commit secrets. Never force-push or run destructive Git commands
  without explicit instruction.

*Update the phase statuses above (and `docs/PROJECT_STATUS.md`) as work
progresses.*
