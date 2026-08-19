import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { InvoiceForm } from "@/components/invoices/invoice-form";

export const metadata = { title: "New Invoice - Worklyn" };

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string }>;
}) {
  const { client } = await searchParams;
  const supabase = await createClient();
  const [{ data: clients }, { data: projects }] = await Promise.all([
    supabase.from("clients").select("id, name").order("name"),
    supabase.from("projects").select("id, client_id, name").order("name"),
  ]);

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        New Invoice
      </h1>
      <Card className="p-6">
        <InvoiceForm
          clients={clients ?? []}
          projects={projects ?? []}
          defaultClientId={client}
        />
      </Card>
    </div>
  );
}
