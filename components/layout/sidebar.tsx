"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, LogOut } from "lucide-react";
import { navItems } from "@/lib/nav-items";
import { logout } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
import { DemoDataSidebarButton } from "@/components/layout/demo-data-sidebar-button";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col border-r border-slate-200 bg-surface-container-lowest md:flex">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-on-primary">
          <Boxes className="h-5 w-5" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-slate-900">
          Worklyn
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary-fixed text-on-primary-fixed-variant"
                  : "text-secondary hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <DemoDataSidebarButton />
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
