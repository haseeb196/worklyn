"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { invoiceSchema } from "@/lib/validations/invoices";

export type ActionResult = { error: string } | { success: true };

function parseForm(formData: FormData) {
  const itemsRaw = formData.get("items_json");
  let items: unknown = [];
  try {
    items = JSON.parse(String(itemsRaw ?? "[]"));
  } catch {
    items = [];
  }

  return invoiceSchema.safeParse({
    client_id: formData.get("client_id"),
    project_id: formData.get("project_id") || "",
    invoice_number: formData.get("invoice_number"),
    status: formData.get("status") || "draft",
    issue_date: formData.get("issue_date"),
    due_date: formData.get("due_date") || "",
    currency: formData.get("currency") || "USD",
    tax_rate: formData.get("tax_rate") || 0,
    notes: formData.get("notes") || "",
    items,
  });
}

function calcTotals(
  items: { quantity: number; unit_price: number }[],
  taxRate: number,
) {
  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

export async function createInvoiceAction(
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

  const { subtotal, tax, total } = calcTotals(
    parsed.data.items,
    parsed.data.tax_rate,
  );

  const { data: invoice, error } = await supabase
    .from("invoices")
    .insert({
      user_id: user.id,
      client_id: parsed.data.client_id,
      project_id: parsed.data.project_id || null,
      invoice_number: parsed.data.invoice_number,
      status: parsed.data.status,
      issue_date: parsed.data.issue_date,
      due_date: parsed.data.due_date || null,
      currency: parsed.data.currency,
      notes: parsed.data.notes || null,
      subtotal,
      tax,
      total,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  const { error: itemsError } = await supabase.from("invoice_items").insert(
    parsed.data.items.map((i) => ({
      invoice_id: invoice.id,
      description: i.description,
      quantity: i.quantity,
      unit_price: i.unit_price,
      amount: i.quantity * i.unit_price,
    })),
  );
  if (itemsError) return { error: itemsError.message };

  revalidatePath("/invoices");
  redirect(`/invoices/${invoice.id}`);
}

export async function updateInvoiceStatusAction(
  invoiceId: string,
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled",
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("invoices")
    .update({ status })
    .eq("id", invoiceId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/invoices");
  revalidatePath(`/invoices/${invoiceId}`);
  return { success: true };
}

export async function deleteInvoiceAction(invoiceId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", invoiceId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/invoices");
  redirect("/invoices");
}
