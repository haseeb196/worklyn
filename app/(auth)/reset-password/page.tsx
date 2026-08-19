import { Boxes } from "lucide-react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata = { title: "Set new password - Worklyn" };

export default function ResetPasswordPage() {
  return (
    <main className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-xl border border-slate-200 bg-surface-container-lowest shadow-sm">
      <header className="border-b border-slate-100 bg-surface/50 px-8 pb-6 pt-8 text-center backdrop-blur-sm">
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-on-primary shadow-sm">
            <Boxes className="h-7 w-7" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Set a new password
        </h1>
      </header>

      <div className="p-8">
        <ResetPasswordForm />
      </div>
    </main>
  );
}
