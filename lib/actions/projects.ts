"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { projectSchema } from "@/lib/validations/projects";

export type ActionResult = { error: string } | { success: true };

function parseForm(formData: FormData) {
  return projectSchema.safeParse({
    client_id: formData.get("client_id"),
    name: formData.get("name"),
    description: formData.get("description") || "",
    status: formData.get("status") || "planning",
    start_date: formData.get("start_date") || "",
    due_date: formData.get("due_date") || "",
    budget: formData.get("budget") || null,
    progress: formData.get("progress") || 0,
  });
}

export async function createProjectAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("projects")
    .insert({
      ...parsed.data,
      start_date: parsed.data.start_date || null,
      due_date: parsed.data.due_date || null,
      user_id: user.id,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/projects");
  redirect(`/projects/${data.id}`);
}

export async function updateProjectAction(
  projectId: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("projects")
    .update({
      ...parsed.data,
      start_date: parsed.data.start_date || null,
      due_date: parsed.data.due_date || null,
    })
    .eq("id", projectId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
  return { success: true };
}

export async function deleteProjectAction(projectId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/projects");
  redirect("/projects");
}
