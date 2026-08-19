import Link from "next/link";
import { Card } from "@/components/ui/card";

type ProjectSummary = {
  id: string;
  name: string;
  client_name: string;
  status: string;
  progress: number;
};

export function ProjectList({ projects }: { projects: ProjectSummary[] }) {
  if (projects.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-sm font-medium text-slate-900">
          No active projects yet
        </p>
        <p className="mt-1 text-sm text-secondary">
          Create a project to see it here.
        </p>
      </Card>
    );
  }

  return (
    <Card className="divide-y divide-slate-100">
      {projects.map((p) => (
        <Link
          key={p.id}
          href={`/projects/${p.id}`}
          className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-slate-50"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">
              {p.name}
            </p>
            <p className="truncate text-xs text-secondary">{p.client_name}</p>
          </div>
          <div className="flex w-32 shrink-0 items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${p.progress}%` }}
              />
            </div>
            <span className="w-8 text-right text-xs text-secondary">
              {p.progress}%
            </span>
          </div>
        </Link>
      ))}
    </Card>
  );
}
