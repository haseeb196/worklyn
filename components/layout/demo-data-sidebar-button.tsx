"use client";

import { useActionState } from "react";
import { Database } from "lucide-react";
import {
  createDemoData,
  removeDemoData,
  type DemoActionResult,
} from "@/lib/actions/demo-data";

export function DemoDataSidebarButton() {
  const [state, action, pending] = useActionState<
    DemoActionResult | null,
    FormData
  >(createDemoData, null);
  const [removeState, removeAction, removing] = useActionState<
    DemoActionResult | null,
    FormData
  >(removeDemoData, null);
  const result = state ?? removeState;

  return (
    <div className="p-3">
      <form action={action}>
        <button
          type="submit"
          disabled={pending || removing}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-zinc-800 dark:hover:text-white"
        >
          <Database className="h-[18px] w-[18px]" />
          {pending ? "Loading demo..." : "Load demo data"}
        </button>
      </form>
      <form action={removeAction}>
        <button
          type="submit"
          disabled={pending || removing}
          className="mt-1 flex w-full rounded-lg px-3 py-2 text-xs font-medium text-destructive transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          {removing ? "Removing..." : "Remove demo data"}
        </button>
      </form>
      {result && "error" in result && (
        <p className="px-3 pt-2 text-xs text-destructive">{result.error}</p>
      )}
    </div>
  );
}
