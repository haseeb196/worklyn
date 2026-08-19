import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { InvoiceStatusSelect } from "@/components/invoices/invoice-status-select";
import { DeleteInvoiceButton } from "@/components/invoices/delete-invoice-button";

export const metadata = { title: "Invoice - Worklyn" };

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*, clients(name, email), projects(name)")
    .eq("id", id)
    .single();

  if (!invoice) notFound();

  const { data: items } = await supabase
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", id)
    .order("created_at");

  const client = invoice.clients as unknown as {
    name: string;
    email: string | null;
  } | null;
  const project = invoice.projects as unknown as { name: string } | null;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {invoice.invoice_number}
        </h1>
        <div className="flex items-center gap-2">
          <InvoiceStatusSelect invoiceId={id} status={invoice.status} />
          <DeleteInvoiceButton invoiceId={id} />
        </div>
      </div>

      <Card className="p-6">
        <div className="flex flex-wrap justify-between gap-6 border-b border-slate-100 pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Billed To
            </p>
            <p className="mt-1 text-sm font-medium text-slate-900">
              {client?.name ?? "—"}
            </p>
            {client?.email && (
              <p className="text-sm text-secondary">{client.email}</p>
            )}
            {project && (
              <p className="text-sm text-secondary">{project.name}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Issue Date
            </p>
            <p className="mt-1 text-sm text-slate-900">{invoice.issue_date}</p>
            {invoice.due_date && (
              <>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-secondary">
                  Due Date
                </p>
                <p className="mt-1 text-sm text-slate-900">
                  {invoice.due_date}
                </p>
              </>
            )}
          </div>
        </div>

        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wider text-secondary">
              <th className="pb-2">Description</th>
              <th className="pb-2 text-right">Qty</th>
              <th className="pb-2 text-right">Price</th>
              <th className="pb-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {(items ?? []).map((item) => (
              <tr key={item.id} className="border-b border-slate-50">
                <td className="py-2 text-slate-900">{item.description}</td>
                <td className="py-2 text-right text-secondary">
                  {item.quantity}
                </td>
                <td className="py-2 text-right text-secondary">
                  {Number(item.unit_price).toFixed(2)}
                </td>
                <td className="py-2 text-right text-slate-900">
                  {Number(item.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ml-auto mt-4 max-w-xs space-y-1 text-sm">
          <div className="flex justify-between text-secondary">
            <span>Subtotal</span>
            <span>
              {invoice.currency} {Number(invoice.subtotal).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-secondary">
            <span>Tax</span>
            <span>
              {invoice.currency} {Number(invoice.tax).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-1 font-semibold text-slate-900">
            <span>Total</span>
            <span>
              {invoice.currency} {Number(invoice.total).toFixed(2)}
            </span>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-6 border-t border-slate-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Notes
            </p>
            <p className="mt-1 text-sm text-secondary">{invoice.notes}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
