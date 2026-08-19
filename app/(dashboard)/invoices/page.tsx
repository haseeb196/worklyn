import { createClient } from "@/lib/supabase/server";
import { InvoicesTable } from "@/components/invoices/invoices-table";

export const metadata = { title: "Invoices - Worklyn" };

export default async function InvoicesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("invoices")
    .select(
      "id, invoice_number, status, total, currency, due_date, clients(name)",
    )
    .order("created_at", { ascending: false });

  const invoices = (data ?? []).map((i) => ({
    id: i.id,
    invoice_number: i.invoice_number,
    client_name: (i.clients as unknown as { name: string } | null)?.name ?? "—",
    status: i.status,
    total: Number(i.total),
    currency: i.currency,
    due_date: i.due_date,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Invoices
      </h1>
      <InvoicesTable invoices={invoices} />
    </div>
  );
}
