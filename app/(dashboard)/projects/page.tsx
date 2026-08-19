import { createClient } from "@/lib/supabase/server";
import { ProjectsGrid } from "@/components/projects/projects-grid";

export const metadata = { title: "Projects - Worklyn" };

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("id, name, status, progress, due_date, clients(name)")
    .order("created_at", { ascending: false });

  const projects = (data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    client_name: (p.clients as unknown as { name: string } | null)?.name ?? "—",
    status: p.status,
    progress: p.progress ?? 0,
    due_date: p.due_date,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Projects
      </h1>
      <ProjectsGrid projects={projects} />
    </div>
  );
}
