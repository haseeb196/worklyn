"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { error: string } | { success: true };

export async function createCommentAction(
  projectId: string,
  content: string,
): Promise<ActionResult> {
  if (!content.trim()) return { error: "Comment cannot be empty" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Determine whether this user is the freelancer owner or a portal client.
  const { data: clientRow } = await supabase
    .from("clients")
    .select("id")
    .eq("portal_user_id", user.id)
    .maybeSingle();

  const { error } = await supabase.from("comments").insert({
    project_id: projectId,
    content,
    user_id: clientRow ? null : user.id,
    client_id: clientRow ? clientRow.id : null,
  });

  if (error) return { error: error.message };

  revalidatePath(`/portal/${projectId}`);
  revalidatePath(`/projects/${projectId}`);
  return { success: true };
}
