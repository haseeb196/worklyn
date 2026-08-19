"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type ClientRow = {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  status: "active" | "inactive";
  project_count: number;
};

export function ClientsTable({ clients }: { clients: ClientRow[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const matchesQuery =
        query.trim() === "" ||
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        (c.company ?? "").toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [clients, query, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients…"
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as typeof statusFilter)
            }
            className="rounded-lg border border-slate-200 bg-surface-container-lowest px-3 py-2 text-sm"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Link href="/clients/new">
            <Button size="sm">
              <Plus className="h-4 w-4" /> Add Client
            </Button>
          </Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-sm font-medium text-slate-900">
            {clients.length === 0 ? "No clients yet" : "No matching clients"}
          </p>
          <p className="mt-1 text-sm text-secondary">
            {clients.length === 0
              ? "Add your first client to start managing your projects."
              : "Try a different search or filter."}
          </p>
        </Card>
      ) : (
        <Card className="divide-y divide-slate-100">
          {filtered.map((c) => (
            <Link
              key={c.id}
              href={`/clients/${c.id}`}
              className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-slate-50"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-container text-sm font-semibold text-on-primary-container">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {c.name}
                  </p>
                  <p className="truncate text-xs text-secondary">
                    {c.company ?? c.email ?? "—"}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <span className="hidden text-xs text-secondary sm:block">
                  {c.project_count} project{c.project_count === 1 ? "" : "s"}
                </span>
                <Badge status={c.status} />
              </div>
            </Link>
          ))}
        </Card>
      )}
    </div>
  );
}
