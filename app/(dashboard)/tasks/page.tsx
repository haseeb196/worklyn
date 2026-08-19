import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Tasks - Worklyn" };

const COLUMNS = [
  { key: "todo", label: "Todo" },
  { key: "in_progress", label: "In Progress" },
  { key: "review", label: "Review" },
  { key: "completed", label: "Completed" },
] as const;

export default async function TasksPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tasks")
    .select("id, title, status, priority, due_date, projects(id, name)")
    .order("due_date", { ascending: true, nullsFirst: false });

  const tasks = data ?? [];

  if (tasks.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Tasks
        </h1>
        <Card className="p-10 text-center">
          <p className="text-sm font-medium text-slate-900">No tasks yet</p>
          <p className="mt-1 text-sm text-secondary">
            Create tasks from within a project.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Tasks
      </h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {COLUMNS.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">
                {col.label} ({columnTasks.length})
              </h3>
              <div className="space-y-2">
                {columnTasks.map((t) => {
                  const project = t.projects as unknown as {
                    id: string;
                    name: string;
                  } | null;
                  return (
                    <Link
                      key={t.id}
                      href={project ? `/projects/${project.id}` : "#"}
                    >
                      <Card className="p-3 transition-colors hover:bg-slate-50">
                        <p className="text-sm text-slate-900">{t.title}</p>
                        <p className="mt-1 text-xs text-secondary">
                          {project?.name ?? "—"}
                          {t.due_date ? ` · Due ${t.due_date}` : ""}
                        </p>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
