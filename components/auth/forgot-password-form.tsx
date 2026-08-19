"use client";

import { useActionState } from "react";
import { Mail } from "lucide-react";
import { requestPasswordReset, type ActionResult } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ActionResult | null = null;

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    initialState,
  );

  if (state && "success" in state) {
    return (
      <p className="text-sm text-on-surface">
        If an account exists for that email, we&apos;ve sent a password reset
        link. Check your inbox.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-outline" />
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@agency.com"
            className="pl-10"
            required
          />
        </div>
      </div>

      {state && "error" in state && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
}
