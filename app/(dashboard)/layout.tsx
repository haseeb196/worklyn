import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Header } from "@/components/layout/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense in depth: middleware already redirects unauthenticated users,
  // but this layout re-checks server-side rather than trusting that alone.
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Header userEmail={user.email} />
        <main className="flex-1 space-y-6 p-4 pb-20 md:p-8 md:pb-8">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
