import { Bell, Building2, Lock, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata = { title: "Settings - Worklyn" };

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-2 text-sm text-secondary">
          Manage your profile, workspace, and notification preferences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="space-y-1" aria-label="Settings sections">
          <a
            className="flex items-center gap-3 rounded-lg bg-primary-fixed px-3 py-2.5 text-sm font-medium text-on-primary-fixed-variant"
            href="#profile"
          >
            <UserRound className="h-4 w-4" />
            Profile
          </a>
          <a
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-secondary hover:bg-slate-100"
            href="#workspace"
          >
            <Building2 className="h-4 w-4" />
            Workspace
          </a>
          <a
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-secondary hover:bg-slate-100"
            href="#notifications"
          >
            <Bell className="h-4 w-4" />
            Notifications
          </a>
          <a
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-secondary hover:bg-slate-100"
            href="#security"
          >
            <Lock className="h-4 w-4" />
            Security
          </a>
        </nav>

        <div className="space-y-6">
          <Card id="profile" className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Profile
            </h2>
            <p className="mt-1 text-sm text-secondary">
              The name and contact details clients see.
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="full-name">Full name</Label>
                <Input id="full-name" placeholder="Your name" />
              </div>
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" placeholder="you@agency.com" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" placeholder="Freelance designer" />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button>Save profile</Button>
            </div>
          </Card>

          <Card id="workspace" className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Workspace
            </h2>
            <p className="mt-1 text-sm text-secondary">
              Set the identity of your business.
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="workspace-name">Workspace name</Label>
                <Input id="workspace-name" placeholder="Your studio" />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input id="website" placeholder="https://yourstudio.com" />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button>Save workspace</Button>
            </div>
          </Card>

          <Card id="notifications" className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Notifications
            </h2>
            <p className="mt-1 text-sm text-secondary">
              Choose which updates reach your inbox.
            </p>
            <div className="mt-6 space-y-4">
              {[
                [
                  "Task reminders",
                  "Get a reminder before an assigned task is due.",
                ],
                [
                  "Client comments",
                  "Know when a client responds in the portal.",
                ],
                [
                  "Invoice updates",
                  "Receive a note when an invoice status changes.",
                ],
              ].map(([title, description]) => (
                <label key={title} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-primary accent-primary"
                  />
                  <span>
                    <span className="block text-sm font-medium text-slate-900 dark:text-white">
                      {title}
                    </span>
                    <span className="mt-1 block text-sm text-secondary">
                      {description}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <Button>Save preferences</Button>
            </div>
          </Card>

          <Card id="security" className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Security
            </h2>
            <p className="mt-1 text-sm text-secondary">
              Keep your account protected.
            </p>
            <div className="mt-5 flex items-center justify-between rounded-lg bg-surface-container-low p-4">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Password
                </p>
                <p className="mt-1 text-sm text-secondary">
                  Change your account password.
                </p>
              </div>
              <Button variant="secondary">Change password</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
