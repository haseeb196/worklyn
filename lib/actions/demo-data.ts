"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const DEMO_EMAIL_PREFIX = "demo+";
export type DemoActionResult = { error: string } | { success: true };

export async function createDemoData(): Promise<DemoActionResult> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: "Not authenticated" };

  const { data: existing } = await supabase
    .from("clients")
    .select("id")
    .eq("user_id", auth.user.id)
    .like("email", `${DEMO_EMAIL_PREFIX}%@worklyn.test`)
    .limit(1);
  if (existing?.length) return { error: "Demo data is already loaded." };

  const clientsInput = [
    ["Maya Chen", "Northline Studio"],
    ["Jon Bell", "Bell & Co"],
    ["Priya Shah", "Fieldnote Labs"],
    ["Owen Wright", "Wright House"],
    ["Lena Ortiz", "Cedar & Form"],
  ];
  const { data: clients, error: clientError } = await supabase
    .from("clients")
    .insert(
      clientsInput.map(([name, company], index) => ({
        user_id: auth.user.id,
        name,
        company,
        email: `demo+${index + 1}@worklyn.test`,
        status: "active" as const,
        notes: "Demo client for exploring Worklyn.",
      })),
    )
    .select("id");
  if (clientError || !clients)
    return { error: clientError?.message ?? "Could not create demo clients." };

  const projectInput = [
    ["Website refresh", "active", 64, 4800],
    ["Brand direction", "planning", 18, 3200],
    ["Launch campaign", "active", 42, 6800],
    ["Client portal audit", "on_hold", 27, 2100],
    ["Quarterly content", "completed", 100, 3900],
  ];
  const { data: projects, error: projectError } = await supabase
    .from("projects")
    .insert(
      projectInput.map(([name, status, progress, budget], index) => ({
        user_id: auth.user.id,
        client_id: clients[index].id,
        name,
        description: "A sample project showing the Worklyn delivery flow.",
        status,
        progress,
        budget,
        start_date: new Date().toISOString().slice(0, 10),
      })),
    )
    .select("id");
  if (projectError || !projects)
    return {
      error: projectError?.message ?? "Could not create demo projects.",
    };

  const taskTitles = [
    "Share revised homepage copy",
    "Collect brand references",
    "Review campaign concepts",
    "Confirm portal permissions",
    "Prepare final handoff",
    "Send invoice for milestone two",
    "Draft visual system",
    "Schedule launch review",
    "Document findings",
    "Archive project files",
  ];
  const { error: tasksError } = await supabase.from("tasks").insert(
    projects.flatMap((project, index) => [
      {
        user_id: auth.user.id,
        assigned_to: auth.user.id,
        project_id: project.id,
        title: taskTitles[index],
        status: index === 4 ? "completed" : "todo",
        priority: index === 0 ? "high" : "medium",
      },
      {
        user_id: auth.user.id,
        assigned_to: auth.user.id,
        project_id: project.id,
        title: taskTitles[index + 5],
        status: "todo",
        priority: "medium",
      },
    ]),
  );
  if (tasksError) return { error: tasksError.message };

  const amounts = [2400, 1600, 3400];
  const { error: invoiceError } = await supabase
    .from("invoices")
    .insert(
      projects
        .slice(0, 3)
        .map((project, index) => ({
          user_id: auth.user.id,
          client_id: clients[index].id,
          project_id: project.id,
          invoice_number: `INV-DEMO-00${index + 1}`,
          status: index === 2 ? "paid" : "sent",
          issue_date: new Date().toISOString().slice(0, 10),
          currency: "USD",
          subtotal: amounts[index],
          tax: 0,
          total: amounts[index],
          notes: "Demo invoice for exploring Worklyn.",
        })),
    );
  if (invoiceError) return { error: invoiceError.message };

  revalidatePaths();
  return { success: true };
}

export async function removeDemoData(): Promise<DemoActionResult> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: "Not authenticated" };
  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("user_id", auth.user.id)
    .like("email", `${DEMO_EMAIL_PREFIX}%@worklyn.test`);
  if (error) return { error: error.message };
  revalidatePaths();
  return { success: true };
}

function revalidatePaths() {
  [
    "/dashboard",
    "/clients",
    "/projects",
    "/tasks",
    "/invoices",
    "/settings",
  ].forEach((path) => revalidatePath(path));
}
