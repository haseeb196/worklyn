import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ClipboardList,
  Receipt,
  FileText,
  Settings,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Projects", href: "/projects", icon: Briefcase },
  { label: "Tasks", href: "/tasks", icon: ClipboardList },
  { label: "Invoices", href: "/invoices", icon: Receipt },
  { label: "Files", href: "/files", icon: FileText },
  { label: "Settings", href: "/settings", icon: Settings },
];

// Stitch mobile bottom nav uses a shorter subset (Home / Tasks / Projects / Me)
export const mobileNavItems: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Tasks", href: "/tasks", icon: ClipboardList },
  { label: "Projects", href: "/projects", icon: Briefcase },
  { label: "Settings", href: "/settings", icon: Settings },
];
