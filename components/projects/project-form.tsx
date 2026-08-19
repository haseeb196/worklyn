"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionResult } from "@/lib/actions/projects";

type ProjectFormValues = {
  client_id: string;
  name: string;
  description: string | null;
  status: string;
  start_date: string | null;
  due_date: string | null;
  budget: number | null;
  progress: number;
};

export function ProjectForm({
  action,
  clients,
  defaultValues,
  submitLabel,
}: {
  action: (
    prev: ActionResult | null,
    formData: FormData,
  ) => Promise<ActionResult>;
  clients: { id: string; name: string }[];
  defaultValues?: Partial<ProjectFormValues>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  useEffect(() => {
    if (state && "success" in state) toast.success("Saved");
  }, [state]);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="client_id">Client</Label>
          <select
            id="client_id"
            name="client_id"
            defaultValue={defaultValues?.client_id}
            required
            className="block w-full rounded-lg border border-slate-200 bg-surface-container-lowest px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="" disabled>
              Select a client
            </option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={defaultValues?.name}
            required
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={defaultValues?.status ?? "planning"}
            className="block w-full rounded-lg border border-slate-200 bg-surface-container-lowest px-3 py-2.5 text-sm capitalize focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            {["planning", "active", "on_hold", "completed", "cancelled"].map(
              (s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ),
            )}
          </select>
        </div>
        <div>
          <Label htmlFor="budget">Budget</Label>
          <Input
            id="budget"
            name="budget"
            type="number"
            step="0.01"
            defaultValue={defaultValues?.budget ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            defaultValue={defaultValues?.start_date ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="due_date">Due Date</Label>
          <Input
            id="due_date"
            name="due_date"
            type="date"
            defaultValue={defaultValues?.due_date ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="progress">Progress (%)</Label>
          <Input
            id="progress"
            name="progress"
            type="number"
            min={0}
            max={100}
            defaultValue={defaultValues?.progress ?? 0}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={defaultValues?.description ?? ""}
          className="block w-full rounded-lg border border-slate-200 bg-surface-container-lowest px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {state && "error" in state && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
