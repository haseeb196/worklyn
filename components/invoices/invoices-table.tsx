"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type InvoiceRow = {
  id: string;
  invoice_number: string;
  client_name: string;
  status: string;
  total: number;
  currency: string;
  due_date: string | null;
};

const STATUSES = [
  "all",
  "draft",
  "sent",
  "paid",
  "overdue",
  "cancelled",
] as const;

export function InvoicesTable({ invoices }: { invoices: InvoiceRow[] }) {
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("all");

  const filtered = useMemo(
    () => invoices.filter((i) => status === "all" || i.status === status),
    [invoices, status],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="rounded-lg border border-slate-200 bg-surface-container-lowest px-3 py-2 text-sm capitalize"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All statuses" : s}
            </option>
          ))}
        </select>
        <Link href="/invoices/new">
          <Button size="sm">
            <Plus className="h-4 w-4" /> New Invoice
          </Button>
        </Link>
      </div>

      {filtered.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-sm font-medium text-slate-900">
            {invoices.length === 0 ? "No invoices yet" : "No matching invoices"}
          </p>
          <p className="mt-1 text-sm text-secondary">
            {invoices.length === 0
              ? "Create your first invoice to start billing clients."
              : "Try a different filter."}
          </p>
        </Card>
      ) : (
        <Card className="divide-y divide-slate-100">
          {filtered.map((inv) => (
            <Link
              key={inv.id}
              href={`/invoices/${inv.id}`}
              className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900">
                  {inv.invoice_number}
                </p>
                <p className="truncate text-xs text-secondary">
                  {inv.client_name}
                  {inv.due_date ? ` · Due ${inv.due_date}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-sm text-secondary">
                  {inv.currency} {inv.total.toLocaleString()}
                </span>
                <Badge status={inv.status} />
              </div>
            </Link>
          ))}
        </Card>
      )}
    </div>
  );
}
