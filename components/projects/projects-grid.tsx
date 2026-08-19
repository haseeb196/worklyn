"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type ProjectRow = {
  id: string;
  name: string;
  client_name: string;
  status: string;
  progress: number;
  due_date: string | null;
};

const STATUSES = [
  "all",
  "planning",
  "active",
  "on_hold",
  "completed",
  "cancelled",
] as const;

export function ProjectsGrid({ projects }: { projects: ProjectRow[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("all");

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesQuery =
        query.trim() === "" ||
        p.name.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === "all" || p.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [projects, query, status]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects…"
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="rounded-lg border border-slate-200 bg-surface-container-lowest px-3 py-2 text-sm capitalize"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All statuses" : s.replace("_", " ")}
              </option>
            ))}
          </select>
          <Link href="/projects/new">
            <Button size="sm">
              <Plus className="h-4 w-4" /> New Project
            </Button>
          </Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-sm font-medium text-slate-900">
            {projects.length === 0 ? "No projects yet" : "No matching projects"}
          </p>
          <p className="mt-1 text-sm text-secondary">
            {projects.length === 0
              ? "Create your first project to start tracking work."
              : "Try a different search or filter."}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Link key={p.id} href={`/projects/${p.id}`}>
              <Card className="h-full p-5 transition-colors hover:bg-slate-50">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {p.name}
                  </h3>
                  <Badge status={p.status} />
                </div>
                <p className="mt-1 text-xs text-secondary">{p.client_name}</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-secondary">{p.progress}%</span>
                </div>
                {p.due_date && (
                  <p className="mt-3 text-xs text-secondary">
                    Due {p.due_date}
                  </p>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
