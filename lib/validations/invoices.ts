import { z } from "zod";

export const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description required"),
  quantity: z.coerce.number().positive(),
  unit_price: z.coerce.number().nonnegative(),
});
export type InvoiceItemInput = z.infer<typeof invoiceItemSchema>;

export const invoiceSchema = z.object({
  client_id: z.string().uuid("Select a client"),
  project_id: z.string().uuid().optional().or(z.literal("")),
  invoice_number: z.string().min(1, "Invoice number required").max(50),
  status: z
    .enum(["draft", "sent", "paid", "overdue", "cancelled"])
    .default("draft"),
  issue_date: z.string().min(1, "Issue date required"),
  due_date: z.string().optional().or(z.literal("")),
  currency: z.string().min(1).max(10).default("USD"),
  tax_rate: z.coerce.number().min(0).max(100).default(0),
  notes: z.string().max(5000).optional().or(z.literal("")),
  items: z.array(invoiceItemSchema).min(1, "Add at least one line item"),
});
export type InvoiceInput = z.infer<typeof invoiceSchema>;
