"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateInvoiceStatusAction } from "@/lib/actions/invoices";

const STATUSES = ["draft", "sent", "paid", "overdue", "cancelled"] as const;

export function InvoiceStatusSelect({
  invoiceId,
  status,
}: {
  invoiceId: string;
  status: (typeof STATUSES)[number];
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) =>
        startTransition(async () => {
          const result = await updateInvoiceStatusAction(
            invoiceId,
            e.target.value as (typeof STATUSES)[number],
          );
          if (result && "error" in result) toast.error(result.error);
          else toast.success("Status updated");
        })
      }
      className="rounded-lg border border-slate-200 bg-surface-container-lowest px-3 py-2 text-sm capitalize"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
