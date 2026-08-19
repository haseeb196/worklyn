"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { deleteProjectAction } from "@/lib/actions/projects";

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  return (
    <ConfirmDialog
      trigger={
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4" /> Delete
        </Button>
      }
      title="Delete this project?"
      description="This will permanently delete the project, its tasks, and file records. This cannot be undone."
      onConfirm={() => deleteProjectAction(projectId)}
    />
  );
}
