"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  MAX_FILE_SIZE_BYTES,
  ALLOWED_MIME_TYPES,
  STORAGE_BUCKET,
} from "@/lib/config/files";

export type ActionResult = { error: string } | { success: true };

export async function uploadFileAction(
  projectId: string,
  formData: FormData,
): Promise<ActionResult> {
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { error: "No file provided" };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      error: `File exceeds the ${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB limit`,
    };
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { error: "File type not allowed" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Ownership check: only the project owner may upload here (client
  // portal uploads, if added later, would use a separate action).
  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();
  if (!project) return { error: "Project not found" };

  const storagePath = `${user.id}/${projectId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, file);
  if (uploadError) return { error: uploadError.message };

  const { error: dbError } = await supabase.from("files").insert({
    user_id: user.id,
    project_id: projectId,
    uploaded_by: user.id,
    name: file.name,
    storage_path: storagePath,
    file_size: file.size,
    mime_type: file.type,
  });
  if (dbError) {
    await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
    return { error: dbError.message };
  }

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/files");
  return { success: true };
}

export async function deleteFileAction(fileId: string, projectId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: fileRow } = await supabase
    .from("files")
    .select("storage_path")
    .eq("id", fileId)
    .eq("user_id", user.id)
    .single();
  if (!fileRow) return { error: "File not found" };

  await supabase.storage.from(STORAGE_BUCKET).remove([fileRow.storage_path]);

  const { error } = await supabase
    .from("files")
    .delete()
    .eq("id", fileId)
    .eq("user_id", user.id);
  if (error) return { error: error.message };

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/files");
  return { success: true };
}

export async function getSignedFileUrl(storagePath: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(storagePath, 60); // 60s expiry, generated on demand
  if (error) return { error: error.message };
  return { url: data.signedUrl };
}
