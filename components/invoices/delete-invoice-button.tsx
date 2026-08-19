"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { deleteInvoiceAction } from "@/lib/actions/invoices";

export function DeleteInvoiceButton({ invoiceId }: { invoiceId: string }) {
  return (
    <ConfirmDialog
      trigger={
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4" /> Delete
        </Button>
      }
      title="Delete this invoice?"
      description="This permanently deletes the invoice and its line items."
      onConfirm={() => deleteInvoiceAction(invoiceId)}
    />
  );
}
