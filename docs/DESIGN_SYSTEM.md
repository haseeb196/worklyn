# DESIGN_SYSTEM.md

## Status

Not yet implemented in code. This document records the design system as
defined by the Stitch export and will be updated with implementation notes
as screens are built.

## Source of truth

The Stitch export (`stitch_inquiry_based_project_start.zip`) is the visual
source of truth, specifically the **`worklyn/DESIGN.md`** token file and
the 23 `worklyn_*` screen exports (`screen.png` + `code.html` per screen).

The `freelanceros_*` folders and `freelanceros/DESIGN.md` in the same
export are **legacy** and must not be used — different (earlier) token
values and the retired product name.

**Known discrepancy to resolve during implementation:** a few
`worklyn_*_branding_update` screen exports (e.g.
`worklyn_login_branding_update`) already show "Worklyn" in the page title
but still embed the *old* freelanceros color tokens (`primary: #4648d4`)
in their inline Tailwind config, rather than the final `worklyn/DESIGN.md`
tokens (`primary: #2c2abc`). Plan: implement all screens using the
`worklyn/DESIGN.md` tokens as the single source of truth for color, and
treat any per-screen HTML color values that conflict with it as export
artifacts to be normalized, not as intentional design decisions. Flag if
this assumption turns out wrong once screens are compared side by side.

## Colors

Primary/neutral/semantic tokens as defined in `worklyn/DESIGN.md`
(front-matter YAML). Key values:

- Primary (indigo/violet): `#2c2abc` — primary actions, focus states,
  progress indicators.
- Neutral: Slate (light mode) / Zinc (dark mode) — typography, borders,
  backgrounds.
- Semantic: Emerald `#10b981` = success, Amber `#f59e0b` = warning,
  Red `#ef4444` = destructive/danger. Used mainly for status badges,
  alerts, and data visualization — low-saturation background tints (e.g.
  light emerald for a "Paid" badge), not solid fills.
- Light mode: `slate-50` page background, `#ffffff` cards.
- Dark mode: `zinc-dark-bg` background, `zinc-dark-surface` cards/modals —
  never pure black.

Full palette is in `worklyn/DESIGN.md`; do not hand-pick colors outside
this token set.

## Typography

Inter exclusively.

| Style | Size | Weight | Line height | Notes |
|---|---|---|---|---|
| headline-lg | 32px (28px mobile) | 700 | 40px (36px) | -0.02em tracking |
| headline-md | 24px | 600 | 32px | -0.01em tracking |
| headline-sm | 18px | 600 | 28px | |
| body-lg | 16px | 400 | 24px | |
| body-md | 14px | 400 | 20px | |
| label-md | 14px | 500 | 20px | |
| label-sm | 12px | 600 | 16px | uppercase, +0.05em tracking, used for metadata labels |

## Spacing

8px base grid. Gutter 24px. Sidebar width 260px (fixed on desktop).
Container padding: 16px mobile / 32px desktop.

## Border radius

`sm` 0.25rem, default 0.5rem (buttons/inputs), `md` 0.75rem, `lg` 1rem
(cards/modals), `xl` 1.5rem, `full` (status badge pills).

## Shadows / elevation

Tonal layering and low-contrast 1px outlines over heavy shadows. "Ambient"
soft, diffuse, low-opacity shadows for floating elements (dropdowns,
modals). Hover state on cards/rows: border/background shift, not a
larger drop shadow.

## Components (per Stitch DESIGN.md)

- **Buttons** — Primary: solid indigo fill, white text, no gradient.
  Secondary: white bg, subtle border, dark text. Ghost: no border/bg,
  light tint on hover.
- **Form fields** — white bg, 1px neutral border; focus ring transitions
  to primary color.
- **Data tables** — no vertical borders, 1px horizontal dividers only,
  row hover highlight, numeric columns right-aligned/tabular-lined.
- **Cards** — 1px border, header separated by divider/tint.
- **Badges** — full-radius pills for statuses (Paid, Overdue, etc).
- **Icons** — Lucide, consistent 1.5–2px stroke, monochrome unless
  indicating status.
- **Navigation** — fixed 260px sidebar desktop; collapses to
  hamburger/bottom nav on mobile per `worklyn_dashboard_mobile`.

## UX states

Every important page needs: loading (skeletons), empty state (e.g. "No
clients yet — Add your first client to start managing your projects."),
error state, success feedback (Sonner toasts), and confirmation dialogs
for destructive actions. Reference screens: `worklyn_dashboard_loading_state`,
`worklyn_clients_empty_state`, `worklyn_projects_empty_state_mobile`,
`worklyn_invoices_loading_state_mobile`.

## Responsive behavior

Mobile: top header + main content + bottom/mobile nav, not a shrunk
desktop layout — see the dedicated `worklyn_*_mobile` exports for each
major screen (dashboard, clients, projects, invoices, project detail,
client detail, client portal, create invoice).

## Dark mode

Tailwind `darkMode: "class"` per the Stitch export config. Zinc-based dark
palette defined in `worklyn/DESIGN.md`. Not required for Phase 1 MVP
functionality but token values are already defined — implement when it
doesn't block phase progress.

## Screen inventory (Stitch reference, 23 screens)

```text
worklyn_landing_page_branding_update    worklyn_login_branding_update
worklyn_signup_branding_update          worklyn_dashboard_loading_state
worklyn_dashboard_mobile                worklyn_clients_empty_state
worklyn_clients_mobile                  worklyn_client_detail_desktop
worklyn_client_detail_mobile            worklyn_client_portal
worklyn_client_portal_mobile            worklyn_projects
worklyn_projects_mobile                 worklyn_projects_empty_state_mobile
worklyn_project_detail                  worklyn_project_detail_mobile
worklyn_create_invoice                  worklyn_create_invoice_mobile
worklyn_invoices                        worklyn_invoices_mobile
worklyn_invoices_loading_state_mobile   worklyn_settings_updated
worklyn_settings_branding_update        worklyn_global_brand_alignment
```

*Update this document with real implementation notes and any deviations
from Stitch as each screen is built.*
