import { createClient } from "@/lib/supabase/server";

export async function getDashboardData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const [clientsRes, projectsRes, invoicesRes, tasksRes] = await Promise.all([
    supabase.from("clients").select("id", { count: "exact", head: true }),
    supabase
      .from("projects")
      .select("id, name, status, progress, clients(name)")
      .eq("status", "active")
      .order("updated_at", { ascending: false })
      .limit(5),
    supabase.from("invoices").select("id, status, total"),
    supabase
      .from("tasks")
      .select("id, title, due_date, priority, projects(name)")
      .neq("status", "completed")
      .order("due_date", { ascending: true, nullsFirst: false })
      .limit(5),
  ]);

  const invoices = invoicesRes.data ?? [];
  const totalRevenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + Number(i.total ?? 0), 0);
  const pendingInvoices = invoices.filter((i) =>
    ["sent", "overdue"].includes(i.status),
  ).length;

  return {
    totalRevenue,
    activeProjectsCount: projectsRes.data?.length ?? 0,
    pendingInvoices,
    totalClients: clientsRes.count ?? 0,
    projects: (projectsRes.data ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      client_name:
        (p.clients as unknown as { name: string } | null)?.name ?? "—",
      status: p.status,
      progress: p.progress ?? 0,
    })),
    tasks: (tasksRes.data ?? []).map((t) => ({
      id: t.id,
      title: t.title,
      project_name:
        (t.projects as unknown as { name: string } | null)?.name ?? "—",
      due_date: t.due_date,
      priority: t.priority,
    })),
  };
}
