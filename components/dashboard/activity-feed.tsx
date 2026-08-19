import {
  Receipt,
  CheckCircle2,
  FileUp,
  UserPlus,
  FolderKanban,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ActivityType =
  | "invoice_paid"
  | "task_completed"
  | "file_uploaded"
  | "client_added"
  | "project_updated";

type ActivityItem = {
  id: string;
  type: ActivityType;
  text: string;
  timestamp: string;
};

const iconMap: Record<ActivityType, typeof Receipt> = {
  invoice_paid: Receipt,
  task_completed: CheckCircle2,
  file_uploaded: FileUp,
  client_added: UserPlus,
  project_updated: FolderKanban,
};

const colorMap: Record<ActivityType, string> = {
  invoice_paid: "text-success bg-success/10",
  task_completed: "text-success bg-success/10",
  file_uploaded: "text-primary bg-primary/10",
  client_added: "text-primary bg-primary/10",
  project_updated: "text-warning bg-warning/10",
};

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-sm text-secondary">No recent activity yet.</p>
      </Card>
    );
  }

  return (
    <Card className="divide-y divide-slate-100">
      {items.map((item) => {
        const Icon = iconMap[item.type];
        return (
          <div key={item.id} className="flex items-start gap-3 px-5 py-4">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                colorMap[item.type],
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-slate-900">{item.text}</p>
              <p className="mt-0.5 text-xs text-secondary">{item.timestamp}</p>
            </div>
          </div>
        );
      })}
    </Card>
  );
}
