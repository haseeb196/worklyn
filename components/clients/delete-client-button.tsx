"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { deleteClientAction } from "@/lib/actions/clients";

export function DeleteClientButton({ clientId }: { clientId: string }) {
  return (
    <ConfirmDialog
      trigger={
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4" /> Delete
        </Button>
      }
      title="Delete this client?"
      description="This will permanently delete the client and cannot be undone. Related projects, invoices, and files are not automatically deleted."
      onConfirm={() => deleteClientAction(clientId)}
    />
  );
}
