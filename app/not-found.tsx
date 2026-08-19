import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 text-center">
      <p className="text-3xl font-semibold text-slate-900">404</p>
      <p className="text-sm text-secondary">This page doesn&apos;t exist.</p>
      <Link href="/">
        <Button size="sm">Back to home</Button>
      </Link>
    </div>
  );
}
