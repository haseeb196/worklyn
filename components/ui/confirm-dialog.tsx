"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ConfirmDialog({
  trigger,
  title,
  description,
  onConfirm,
  confirmLabel = "Delete",
}: {
  trigger: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmLabel?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-surface-container-lowest p-6 shadow-lg">
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <p className="mt-1.5 text-sm text-secondary">{description}</p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setOpen(false);
                  onConfirm();
                }}
              >
                {confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
