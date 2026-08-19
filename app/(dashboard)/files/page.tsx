import Link from "next/link";
import { FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Files - Worklyn" };

export default async function FilesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("files")
    .select("id, name, file_size, created_at, projects(id, name)")
    .order("created_at", { ascending: false });

  const files = data ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Files
      </h1>
      {files.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-sm font-medium text-slate-900">
            No files uploaded yet
          </p>
          <p className="mt-1 text-sm text-secondary">
            Upload files from within a project.
          </p>
        </Card>
      ) : (
        <Card className="divide-y divide-slate-100">
          {files.map((f) => {
            const project = f.projects as unknown as {
              id: string;
              name: string;
            } | null;
            return (
              <Link
                key={f.id}
                href={project ? `/projects/${project.id}` : "#"}
                className="flex items-center justify-between px-5 py-3 hover:bg-slate-50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <FileText className="h-4 w-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="truncate text-sm text-slate-900">{f.name}</p>
                    <p className="truncate text-xs text-secondary">
                      {project?.name ?? "—"}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-xs text-secondary">
                  {(f.file_size / 1024).toFixed(0)} KB
                </span>
              </Link>
            );
          })}
        </Card>
      )}
    </div>
  );
}
