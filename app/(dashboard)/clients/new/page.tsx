import { Card } from "@/components/ui/card";
import { ClientForm } from "@/components/clients/client-form";
import { createClientAction } from "@/lib/actions/clients";

export const metadata = { title: "New Client - Worklyn" };

export default function NewClientPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        New Client
      </h1>
      <Card className="p-6">
        <ClientForm action={createClientAction} submitLabel="Create Client" />
      </Card>
    </div>
  );
}
