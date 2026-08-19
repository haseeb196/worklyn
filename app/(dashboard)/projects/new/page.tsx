import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { ProjectForm } from "@/components/projects/project-form";
import { createProjectAction } from "@/lib/actions/projects";

export const metadata = { title: "New Project - Worklyn" };

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string }>;
}) {
  const { client } = await searchParams;
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("id, name")
    .order("name");

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        New Project
      </h1>
      <Card className="p-6">
        <ProjectForm
          action={createProjectAction}
          clients={clients ?? []}
          defaultValues={client ? { client_id: client } : undefined}
          submitLabel="Create Project"
        />
      </Card>
    </div>
  );
}
