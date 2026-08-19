import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { updateClientAction } from "@/lib/actions/clients";
import { ClientForm } from "@/components/clients/client-form";
import { DeleteClientButton } from "@/components/clients/delete-client-button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Client - Worklyn" };

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: clientRow } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (!clientRow) notFound();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, status, progress")
    .eq("client_id", id)
    .order("created_at", { ascending: false });

  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, invoice_number, status, total, currency")
    .eq("client_id", id)
    .order("created_at", { ascending: false });

  const updateAction = updateClientAction.bind(null, id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-container text-base font-semibold text-on-primary-container">
            {clientRow.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {clientRow.name}
            </h1>
            <p className="text-sm text-secondary">
              {clientRow.company ?? clientRow.email ?? ""}
            </p>
          </div>
          <Badge status={clientRow.status} />
        </div>
        <DeleteClientButton clientId={id} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
              <h2 className="text-sm font-semibold text-slate-900">Projects</h2>
              <Link href={`/projects/new?client=${id}`}>
                <Button size="sm" variant="secondary">
                  <Plus className="h-4 w-4" /> New Project
                </Button>
              </Link>
            </div>
            {!projects || projects.length === 0 ? (
              <p className="px-5 py-6 text-sm text-secondary">
                No projects yet.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {projects.map((p) => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.id}`}
                    className="flex items-center justify-between px-5 py-3 hover:bg-slate-50"
                  >
                    <span className="text-sm font-medium text-slate-900">
                      {p.name}
                    </span>
                    <Badge status={p.status} />
                  </Link>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
              <h2 className="text-sm font-semibold text-slate-900">Invoices</h2>
              <Link href={`/invoices/new?client=${id}`}>
                <Button size="sm" variant="secondary">
                  <Plus className="h-4 w-4" /> New Invoice
                </Button>
              </Link>
            </div>
            {!invoices || invoices.length === 0 ? (
              <p className="px-5 py-6 text-sm text-secondary">
                No invoices yet.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <Link
                    key={inv.id}
                    href={`/invoices/${inv.id}`}
                    className="flex items-center justify-between px-5 py-3 hover:bg-slate-50"
                  >
                    <span className="text-sm font-medium text-slate-900">
                      {inv.invoice_number}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-secondary">
                        {inv.currency} {Number(inv.total).toLocaleString()}
                      </span>
                      <Badge status={inv.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">
            Edit Client
          </h2>
          <ClientForm
            action={updateAction}
            defaultValues={clientRow}
            submitLabel="Save Changes"
          />
        </Card>
      </div>
    </div>
  );
}
