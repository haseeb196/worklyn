import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  company: z.string().max(200).optional().or(z.literal("")),
  phone: z.string().max(50).optional().or(z.literal("")),
  website: z.string().max(300).optional().or(z.literal("")),
  notes: z.string().max(5000).optional().or(z.literal("")),
  status: z.enum(["active", "inactive"]).default("active"),
});
export type ClientInput = z.infer<typeof clientSchema>;
