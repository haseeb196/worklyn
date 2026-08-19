"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { clientSchema } from "@/lib/validations/clients";

export type ActionResult = { error: string } | { success: true };

function parseForm(formData: FormData) {
  return clientSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email") || "",
    company: formData.get("company") || "",
    phone: formData.get("phone") || "",
    website: formData.get("website") || "",
    notes: formData.get("notes") || "",
    status: formData.get("status") || "active",
  });
}

export async function createClientAction(
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
    .from("clients")
    .insert({ ...parsed.data, user_id: user.id })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/clients");
  redirect(`/clients/${data.id}`);
}

export async function updateClientAction(
  clientId: string,
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

  // RLS also enforces ownership, but check explicitly for a clear error
  // instead of a silent no-op update.
  const { error } = await supabase
    .from("clients")
    .update(parsed.data)
    .eq("id", clientId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/clients");
  revalidatePath(`/clients/${clientId}`);
  return { success: true };
}

export async function deleteClientAction(clientId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", clientId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/clients");
  redirect("/clients");
}
