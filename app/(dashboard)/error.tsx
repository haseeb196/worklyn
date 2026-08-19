"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <p className="text-sm font-medium text-slate-900">
        Something went wrong.
      </p>
      <p className="text-sm text-secondary">
        Please try again, or contact support if this keeps happening.
      </p>
      <Button onClick={reset} size="sm">
        Try again
      </Button>
    </div>
  );
}
