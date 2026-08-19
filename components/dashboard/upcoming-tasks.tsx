import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TaskSummary = {
  id: string;
  title: string;
  project_name: string;
  due_date: string | null;
  priority: "low" | "medium" | "high" | "urgent";
};

const priorityColor: Record<TaskSummary["priority"], string> = {
  low: "bg-slate-100 text-secondary",
  medium: "bg-primary-fixed text-on-primary-fixed-variant",
  high: "bg-warning/10 text-warning",
  urgent: "bg-destructive/10 text-destructive",
};

export function UpcomingTasks({ tasks }: { tasks: TaskSummary[] }) {
  if (tasks.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-sm text-secondary">No upcoming tasks.</p>
      </Card>
    );
  }

  return (
    <Card className="divide-y divide-slate-100">
      {tasks.map((t) => (
        <div
          key={t.id}
          className="flex items-center justify-between gap-3 px-5 py-3"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">
              {t.title}
            </p>
            <p className="truncate text-xs text-secondary">
              {t.project_name}
              {t.due_date ? ` · Due ${t.due_date}` : ""}
            </p>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
              priorityColor[t.priority],
            )}
          >
            {t.priority}
          </span>
        </div>
      ))}
    </Card>
  );
}
