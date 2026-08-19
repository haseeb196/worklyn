import Link from "next/link";
import { Boxes } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = { title: "Login - Worklyn" };

export default function LoginPage() {
  return (
    <main className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-xl border border-slate-200 bg-surface-container-lowest shadow-sm">
      <header className="border-b border-slate-100 bg-surface/50 px-8 pb-6 pt-8 text-center backdrop-blur-sm">
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-on-primary shadow-sm">
            <Boxes className="h-7 w-7" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Welcome to Worklyn
        </h1>
      </header>

      <div className="p-8">
        <LoginForm />
      </div>

      <footer className="border-t border-slate-100 bg-surface-container/30 px-8 py-6 text-center">
        <p className="text-sm text-secondary">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-primary hover:text-primary-container"
          >
            Create one
          </Link>
        </p>
      </footer>
    </main>
  );
}
