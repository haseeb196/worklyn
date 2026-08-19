import { DollarSign, Briefcase, Receipt, Users } from "lucide-react";
import { getDashboardData } from "@/lib/data/dashboard";
import { StatCard } from "@/components/dashboard/stat-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { ProjectList } from "@/components/dashboard/project-list";
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks";
import { ActivityFeed } from "@/components/dashboard/activity-feed";

export const metadata = { title: "Dashboard - Worklyn" };

// Placeholder chart series until real monthly aggregation is added.
const revenueSeries = [
  { month: "Jan", revenue: 0 },
  { month: "Feb", revenue: 0 },
  { month: "Mar", revenue: 0 },
  { month: "Apr", revenue: 0 },
  { month: "May", revenue: 0 },
  { month: "Jun", revenue: 0 },
];

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data) {
    return (
      <p className="text-sm text-secondary">Sign in to view your dashboard.</p>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Dashboard
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={`$${data.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
        />
        <StatCard
          label="Active Projects"
          value={String(data.activeProjectsCount)}
          icon={Briefcase}
        />
        <StatCard
          label="Pending Invoices"
          value={String(data.pendingInvoices)}
          icon={Receipt}
        />
        <StatCard
          label="Total Clients"
          value={String(data.totalClients)}
          icon={Users}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueSeries} />
        </div>
        <div>
          <h2 className="mb-2 text-sm font-semibold text-slate-900">
            Upcoming Tasks
          </h2>
          <UpcomingTasks tasks={data.tasks} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-2 text-sm font-semibold text-slate-900">
            Active Projects
          </h2>
          <ProjectList projects={data.projects} />
        </div>
        <div>
          <h2 className="mb-2 text-sm font-semibold text-slate-900">
            Recent Activity
          </h2>
          <ActivityFeed items={[]} />
        </div>
      </div>
    </div>
  );
}
