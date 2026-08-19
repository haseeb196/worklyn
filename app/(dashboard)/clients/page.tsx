import { createClient } from "@/lib/supabase/server";
import { ClientsTable } from "@/components/clients/clients-table";

export const metadata = { title: "Clients - Worklyn" };

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("clients")
    .select("id, name, company, email, status, projects(count)")
    .order("created_at", { ascending: false });

  const clients = (data ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    company: c.company,
    email: c.email,
    status: c.status,
    project_count:
      (c.projects as unknown as { count: number }[] | null)?.[0]?.count ?? 0,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Clients
      </h1>
      <ClientsTable clients={clients} />
    </div>
  );
}
