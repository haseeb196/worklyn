import Link from "next/link";
import { Boxes } from "lucide-react";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata = { title: "Forgot password - Worklyn" };

export default function ForgotPasswordPage() {
  return (
    <main className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-xl border border-slate-200 bg-surface-container-lowest shadow-sm">
      <header className="border-b border-slate-100 bg-surface/50 px-8 pb-6 pt-8 text-center backdrop-blur-sm">
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-on-primary shadow-sm">
            <Boxes className="h-7 w-7" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Reset your password
        </h1>
        <p className="mt-1 text-sm text-secondary">
          We&apos;ll email you a link to set a new password.
        </p>
      </header>

      <div className="p-8">
        <ForgotPasswordForm />
      </div>

      <footer className="border-t border-slate-100 bg-surface-container/30 px-8 py-6 text-center">
        <p className="text-sm text-secondary">
          Remembered it?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-primary-container"
          >
            Back to sign in
          </Link>
        </p>
      </footer>
    </main>
  );
}
