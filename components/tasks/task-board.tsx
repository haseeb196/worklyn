"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createTaskAction,
  updateTaskStatusAction,
  deleteTaskAction,
} from "@/lib/actions/tasks";

type Task = {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "review" | "completed";
  priority: "low" | "medium" | "high" | "urgent";
  due_date: string | null;
};

const COLUMNS: { key: Task["status"]; label: string }[] = [
  { key: "todo", label: "Todo" },
  { key: "in_progress", label: "In Progress" },
  { key: "review", label: "Review" },
  { key: "completed", label: "Completed" },
];

const priorityColor: Record<Task["priority"], string> = {
  low: "bg-slate-100 text-secondary",
  medium: "bg-primary-fixed text-on-primary-fixed-variant",
  high: "bg-warning/10 text-warning",
  urgent: "bg-destructive/10 text-destructive",
};

export function TaskBoard({
  projectId,
  initialTasks,
}: {
  projectId: string;
  initialTasks: Task[];
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [title, setTitle] = useState("");
  const [, startTransition] = useTransition();

  function handleAdd() {
    if (!title.trim()) return;
    const formData = new FormData();
    formData.set("project_id", projectId);
    formData.set("title", title);
    formData.set("status", "todo");
    formData.set("priority", "medium");
    setTitle("");
    startTransition(async () => {
      await createTaskAction(null, formData);
    });
  }

  function handleStatusChange(taskId: string, status: Task["status"]) {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t)),
    );
    startTransition(async () => {
      await updateTaskStatusAction(taskId, projectId, status);
    });
  }

  function handleDelete(taskId: string) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    startTransition(async () => {
      await deleteTaskAction(taskId, projectId);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task…"
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <Button onClick={handleAdd} type="button">
          Add
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {COLUMNS.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">
                {col.label} ({columnTasks.length})
              </h3>
              <div className="space-y-2">
                {columnTasks.map((t) => (
                  <Card key={t.id} className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-slate-900">{t.title}</p>
                      <button
                        onClick={() => handleDelete(t.id)}
                        aria-label="Delete task"
                        className="shrink-0 text-outline hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${priorityColor[t.priority]}`}
                      >
                        {t.priority}
                      </span>
                      <select
                        value={t.status}
                        onChange={(e) =>
                          handleStatusChange(
                            t.id,
                            e.target.value as Task["status"],
                          )
                        }
                        className="rounded border border-slate-200 bg-transparent text-xs"
                      >
                        {COLUMNS.map((c) => (
                          <option key={c.key} value={c.key}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
