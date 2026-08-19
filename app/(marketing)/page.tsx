import Link from "next/link";
import {
  Boxes,
  Check,
  ClipboardList,
  FileText,
  FolderKanban,
  Receipt,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Worklyn - Client & Project Management" };

const capabilities = [
  {
    title: "Clients, with context",
    description:
      "Keep contacts, notes, projects, and invoices connected in one place.",
    icon: Users,
    className: "bg-primary-fixed",
  },
  {
    title: "Projects that stay clear",
    description:
      "See progress, deadlines, and the next task without chasing updates.",
    icon: FolderKanban,
    className: "bg-surface-container-low",
  },
  {
    title: "Invoices without a second tool",
    description:
      "Draft, send, and track multi-currency invoices alongside the work.",
    icon: Receipt,
    className: "bg-secondary-container",
  },
  {
    title: "Files where the work lives",
    description:
      "Share project files privately, then find them when you need them.",
    icon: FileText,
    className: "bg-surface-container",
  },
  {
    title: "A portal clients can use",
    description: "Give each client a focused view of the projects you share.",
    icon: ShieldCheck,
    className: "bg-surface-container-high",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-surface-container-lowest">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-8">
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="Worklyn home"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-on-primary">
              <Boxes className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Worklyn
            </span>
          </Link>
          <nav
            className="flex items-center gap-3"
            aria-label="Primary navigation"
          >
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-7xl items-center gap-12 px-6 py-12 md:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)] lg:py-20">
          <div>
            <p className="mb-5 text-sm font-semibold text-primary">
              One workspace for independent work
            </p>
            <h1 className="max-w-xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Run client work without losing the thread.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-secondary">
              Worklyn keeps clients, projects, tasks, files, and invoices in one
              clear workspace.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-surface-container-lowest shadow-[0_20px_50px_rgba(44,42,188,0.10)]">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-sm font-semibold">Monday overview</p>
                <p className="mt-0.5 text-xs text-secondary">
                  Your work, organized by what needs attention.
                </p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-fixed text-primary">
                <ClipboardList className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
            <div className="grid gap-3 p-5 sm:grid-cols-3">
              <div className="rounded-lg bg-surface-container-low p-4">
                <p className="text-xs font-medium text-secondary">
                  Active projects
                </p>
                <p className="mt-2 text-2xl font-semibold">04</p>
              </div>
              <div className="rounded-lg bg-primary-fixed p-4">
                <p className="text-xs font-medium text-on-primary-fixed-variant">
                  Tasks this week
                </p>
                <p className="mt-2 text-2xl font-semibold text-on-primary-fixed">
                  12
                </p>
              </div>
              <div className="rounded-lg bg-secondary-container p-4">
                <p className="text-xs font-medium text-on-secondary-container">
                  Invoices due
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">02</p>
              </div>
            </div>
            <div className="mx-5 mb-5 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div>
                  <p className="text-sm font-medium">Website refresh</p>
                  <p className="text-xs text-secondary">Northline Studio</p>
                </div>
                <span className="rounded-full bg-primary-fixed px-2.5 py-1 text-xs font-medium text-on-primary-fixed-variant">
                  In progress
                </span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 text-sm">
                <Check className="h-4 w-4 text-success" aria-hidden="true" />
                <span>Share revised homepage copy</span>
              </div>
              <div className="flex items-center gap-3 border-t border-slate-100 px-4 py-3 text-sm">
                <span
                  className="h-4 w-4 rounded border border-outline"
                  aria-hidden="true"
                />
                <span>Send invoice for milestone two</span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-surface-container-low">
          <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-24">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Everything important stays connected.
              </h2>
              <p className="mt-4 text-lg leading-8 text-secondary">
                Build a single source of truth for client work, from the first
                brief to the final invoice.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
              {capabilities.map((capability, index) => {
                const Icon = capability.icon;
                return (
                  <article
                    key={capability.title}
                    className={`rounded-xl border border-slate-200 p-6 ${capability.className} ${index === 0 || index === 4 ? "lg:col-span-3" : "lg:col-span-2"}`}
                  >
                    <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    <h3 className="mt-8 text-lg font-semibold">
                      {capability.title}
                    </h3>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-secondary">
                      {capability.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold text-primary">
                A calmer weekly rhythm
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                Move from brief to paid without tool-hopping.
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <FolderKanban
                  className="h-6 w-6 text-primary"
                  aria-hidden="true"
                />
                <h3 className="mt-5 font-semibold">Set up the work</h3>
                <p className="mt-2 text-sm leading-6 text-secondary">
                  Create a client and project with the details that matter.
                </p>
              </div>
              <div>
                <ClipboardList
                  className="h-6 w-6 text-primary"
                  aria-hidden="true"
                />
                <h3 className="mt-5 font-semibold">Keep delivery visible</h3>
                <p className="mt-2 text-sm leading-6 text-secondary">
                  Turn the scope into tasks, deadlines, and clear progress.
                </p>
              </div>
              <div>
                <Receipt className="h-6 w-6 text-primary" aria-hidden="true" />
                <h3 className="mt-5 font-semibold">Close the loop</h3>
                <p className="mt-2 text-sm leading-6 text-secondary">
                  Share the work, send the invoice, and keep the record
                  together.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-container">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:px-8 md:py-24 lg:grid-cols-2 lg:items-center">
            <div className="rounded-xl border border-slate-200 bg-surface-container-lowest p-6 shadow-sm">
              <ShieldCheck
                className="h-7 w-7 text-primary"
                aria-hidden="true"
              />
              <p className="mt-8 text-sm font-semibold text-primary">
                Client portal
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Share progress without sharing the entire workspace.
              </h2>
              <p className="mt-4 text-secondary leading-7">
                Clients get a simple view of the projects, files, invoices, and
                updates that belong to them.
              </p>
            </div>
            <div className="space-y-5">
              <div className="flex gap-4">
                <Check
                  className="mt-1 h-5 w-5 shrink-0 text-success"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="font-semibold">Focused access</h3>
                  <p className="mt-1 text-sm leading-6 text-secondary">
                    Keep internal planning private while clients see the work
                    you explicitly share.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Check
                  className="mt-1 h-5 w-5 shrink-0 text-success"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="font-semibold">Fewer status meetings</h3>
                  <p className="mt-1 text-sm leading-6 text-secondary">
                    Give clients a reliable place to check progress, files, and
                    outstanding invoices.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Check
                  className="mt-1 h-5 w-5 shrink-0 text-success"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="font-semibold">A more professional handoff</h3>
                  <p className="mt-1 text-sm leading-6 text-secondary">
                    Make collaboration feel organized from kickoff through final
                    delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-surface-container-lowest">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-8 text-sm text-secondary md:px-8">
          <p>© {new Date().getFullYear()} Worklyn. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
