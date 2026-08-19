"use client";

import { useActionState } from "react";
import { User, Mail, Lock } from "lucide-react";
import { signup, type ActionResult } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ActionResult | null = null;

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-outline" />
          <Input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="Jordan Smith"
            className="pl-10"
            required
          />
        </div>
      </div>

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

      <div>
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-outline" />
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            className="pl-10"
            required
            minLength={8}
          />
        </div>
      </div>

      {state && "error" in state && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creating account…" : "Create your Workspace"}
      </Button>
    </form>
  );
}
