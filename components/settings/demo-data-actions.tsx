"use client";

import { useActionState } from "react";
import { Database, Trash2 } from "lucide-react";
import {
  createDemoData,
  removeDemoData,
  type DemoActionResult,
} from "@/lib/actions/demo-data";
import { Button } from "@/components/ui/button";

const initialState: DemoActionResult | null = null;

export function DemoDataActions() {
  const [createState, createAction, creating] = useActionState(
    createDemoData,
    initialState,
  );
  const [removeState, removeAction, removing] = useActionState(
    removeDemoData,
    initialState,
  );
  const state = createState ?? removeState;

  return (
    <div className="rounded-lg border border-dashed border-outline-variant bg-surface-container-low p-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <Database className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Demo workspace data
            </h3>
            <p className="mt-1 max-w-xl text-sm text-secondary">
              Add a sample client, project, tasks, and invoice to explore the
              workspace. You can remove it at any time.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <form action={createAction}>
            <Button type="submit" disabled={creating}>
              {creating ? "Loading..." : "Load demo data"}
            </Button>
          </form>
          <form action={removeAction}>
            <Button type="submit" variant="secondary" disabled={removing}>
              {removing ? (
                "Removing..."
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Remove
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
      {state && "error" in state && (
        <p className="mt-3 text-sm text-destructive">{state.error}</p>
      )}
      {state && "success" in state && (
        <p className="mt-3 text-sm text-success">
          Demo data updated successfully.
        </p>
      )}
    </div>
  );
}
