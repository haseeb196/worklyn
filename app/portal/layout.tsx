import { redirect } from "next/navigation";
import { Boxes, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/actions/auth";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-surface-container-lowest px-4 md:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-on-primary">
            <Boxes className="h-4 w-4" />
          </div>
          <span className="font-semibold tracking-tight text-slate-900">
            Worklyn — Client Portal
          </span>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-2 text-sm text-secondary hover:text-slate-900"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </form>
      </header>
      <main className="mx-auto max-w-5xl space-y-6 p-4 md:p-8">{children}</main>
    </div>
  );
}
