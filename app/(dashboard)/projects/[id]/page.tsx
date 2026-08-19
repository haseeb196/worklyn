import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateProjectAction } from "@/lib/actions/projects";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectForm } from "@/components/projects/project-form";
import { ProjectTabs } from "@/components/projects/project-tabs";
import { DeleteProjectButton } from "@/components/projects/delete-project-button";
import { TaskBoard } from "@/components/tasks/task-board";
import { FileManager } from "@/components/files/file-manager";

export const metadata = { title: "Project - Worklyn" };

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*, clients(id, name)")
    .eq("id", id)
    .single();

  if (!project) notFound();

  const [{ data: clients }, { data: tasks }, { data: files }] =
    await Promise.all([
      supabase.from("clients").select("id, name").order("name"),
      supabase
        .from("tasks")
        .select("id, title, status, priority, due_date")
        .eq("project_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("files")
        .select("id, name, file_size, mime_type, storage_path, created_at")
        .eq("project_id", id)
        .order("created_at", { ascending: false }),
    ]);

  const updateAction = updateProjectAction.bind(null, id);
  const clientName =
    (project.clients as unknown as { name: string } | null)?.name ?? "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {project.name}
          </h1>
          <p className="text-sm text-secondary">
            {clientName}
            {project.due_date ? ` · Due ${project.due_date}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge status={project.status} />
          <DeleteProjectButton projectId={id} />
        </div>
      </div>

      <ProjectTabs
        overview={
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <Card className="p-5">
                <h2 className="text-sm font-semibold text-slate-900">
                  Description
                </h2>
                <p className="mt-2 text-sm text-secondary">
                  {project.description || "No description yet."}
                </p>
              </Card>
              <Card className="p-5">
                <h2 className="text-sm font-semibold text-slate-900">
                  Progress
                </h2>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-secondary">
                    {project.progress}%
                  </span>
                </div>
                {project.budget != null && (
                  <p className="mt-4 text-sm text-secondary">
                    Budget: ${Number(project.budget).toLocaleString()}
                  </p>
                )}
              </Card>
            </div>
            <Card className="p-6">
              <h2 className="mb-4 text-sm font-semibold text-slate-900">
                Edit Project
              </h2>
              <ProjectForm
                action={updateAction}
                clients={clients ?? []}
                defaultValues={project}
                submitLabel="Save Changes"
              />
            </Card>
          </div>
        }
        tasks={<TaskBoard projectId={id} initialTasks={tasks ?? []} />}
        files={<FileManager projectId={id} initialFiles={files ?? []} />}
        activity={
          <Card className="p-8 text-center text-sm text-secondary">
            Activity log coming with Phase 9 polish.
          </Card>
        }
      />
    </div>
  );
}
