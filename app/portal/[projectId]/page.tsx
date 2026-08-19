import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommentThread } from "@/components/portal/comment-thread";

export const metadata = { title: "Project Portal - Worklyn" };

export default async function ClientPortalPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const supabase = await createClient();

  // RLS (projects_member_select) restricts this to projects the signed-in
  // client is actually a member of — if not, this returns null.
  const { data: project } = await supabase
    .from("projects")
    .select("id, name, description, status, progress, due_date")
    .eq("id", projectId)
    .single();

  if (!project) notFound();

  const [
    { data: tasks },
    { data: files },
    { data: invoices },
    { data: comments },
  ] = await Promise.all([
    supabase
      .from("tasks")
      .select("id, title, status, priority, due_date")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false }),
    supabase
      .from("files")
      .select("id, name, file_size")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false }),
    supabase
      .from("invoices")
      .select("id, invoice_number, status, total, currency, due_date")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false }),
    supabase
      .from("comments")
      .select("id, content, created_at, profiles(full_name), clients(name)")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true }),
  ]);

  const commentItems = (comments ?? []).map((c) => {
    const author =
      (c.profiles as unknown as { full_name: string } | null)?.full_name ??
      (c.clients as unknown as { name: string } | null)?.name ??
      "Unknown";
    return {
      id: c.id,
      content: c.content,
      created_at: c.created_at,
      author_name: author,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {project.name}
          </h1>
          {project.due_date && (
            <p className="text-sm text-secondary">Due {project.due_date}</p>
          )}
        </div>
        <Badge status={project.status} />
      </div>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-slate-900">Overview</h2>
        <p className="mt-2 text-sm text-secondary">
          {project.description || "No description provided."}
        </p>
        <div className="mt-4 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <span className="text-sm text-secondary">{project.progress}%</span>
        </div>
      </Card>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-slate-900">Tasks</h2>
        {!tasks || tasks.length === 0 ? (
          <Card className="p-6 text-center text-sm text-secondary">
            No tasks yet.
          </Card>
        ) : (
          <Card className="divide-y divide-slate-100">
            {tasks.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <span className="text-sm text-slate-900">{t.title}</span>
                <Badge status={t.status} />
              </div>
            ))}
          </Card>
        )}
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-slate-900">Files</h2>
        {!files || files.length === 0 ? (
          <Card className="p-6 text-center text-sm text-secondary">
            No files shared yet.
          </Card>
        ) : (
          <Card className="divide-y divide-slate-100">
            {files.map((f) => (
              <div key={f.id} className="flex items-center gap-3 px-5 py-3">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm text-slate-900">{f.name}</span>
              </div>
            ))}
          </Card>
        )}
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-slate-900">Invoices</h2>
        {!invoices || invoices.length === 0 ? (
          <Card className="p-6 text-center text-sm text-secondary">
            No invoices yet.
          </Card>
        ) : (
          <Card className="divide-y divide-slate-100">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <span className="text-sm text-slate-900">
                  {inv.invoice_number}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-secondary">
                    {inv.currency} {Number(inv.total).toLocaleString()}
                  </span>
                  <Badge status={inv.status} />
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-slate-900">Comments</h2>
        <CommentThread projectId={projectId} initialComments={commentItems} />
      </div>
    </div>
  );
}
