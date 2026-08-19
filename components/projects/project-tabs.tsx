"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const TABS = ["Overview", "Tasks", "Files", "Activity"] as const;

export function ProjectTabs({
  overview,
  tasks,
  files,
  activity,
}: {
  overview: React.ReactNode;
  tasks: React.ReactNode;
  files: React.ReactNode;
  activity: React.ReactNode;
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const content = {
    Overview: overview,
    Tasks: tasks,
    Files: files,
    Activity: activity,
  };

  return (
    <div>
      <div className="mb-4 flex gap-1 border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              tab === t
                ? "border-primary text-primary"
                : "border-transparent text-secondary hover:text-slate-900",
            )}
          >
            {t}
          </button>
        ))}
      </div>
      <div>{content[tab]}</div>
    </div>
  );
}
