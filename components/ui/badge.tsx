import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  active: "bg-success/10 text-success",
  inactive: "bg-slate-100 text-secondary",
  planning: "bg-slate-100 text-secondary",
  on_hold: "bg-warning/10 text-warning",
  completed: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
  draft: "bg-slate-100 text-secondary",
  sent: "bg-primary-fixed text-on-primary-fixed-variant",
  paid: "bg-success/10 text-success",
  overdue: "bg-destructive/10 text-destructive",
};

export function Badge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
        styles[status] ?? "bg-slate-100 text-secondary",
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
}
