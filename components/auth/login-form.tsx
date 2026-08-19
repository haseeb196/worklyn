"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { login, type ActionResult } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ActionResult | null = null;

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

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

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <Label htmlFor="password" className="mb-0">
            Password
          </Label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary hover:text-primary-container"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-outline" />
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
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
        {pending ? "Signing in…" : "Sign in to Workspace"}
      </Button>
    </form>
  );
}
