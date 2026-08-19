"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { taskSchema } from "@/lib/validations/projects";

export type ActionResult = { error: string } | { success: true };

export async function createTaskAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = taskSchema.safeParse({
    project_id: formData.get("project_id"),
    title: formData.get("title"),
    description: formData.get("description") || "",
    status: formData.get("status") || "todo",
    priority: formData.get("priority") || "medium",
    due_date: formData.get("due_date") || "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("tasks").insert({
    ...parsed.data,
    due_date: parsed.data.due_date || null,
    user_id: user.id,
    assigned_to: user.id,
  });

  if (error) return { error: error.message };

  revalidatePath(`/projects/${parsed.data.project_id}`);
  return { success: true };
}

export async function updateTaskStatusAction(
  taskId: string,
  projectId: string,
  status: "todo" | "in_progress" | "review" | "completed",
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", taskId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath(`/projects/${projectId}`);
  return { success: true };
}

export async function deleteTaskAction(taskId: string, projectId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath(`/projects/${projectId}`);
  return { success: true };
}
