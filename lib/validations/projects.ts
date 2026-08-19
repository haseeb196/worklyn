import { z } from "zod";

export const projectSchema = z.object({
  client_id: z.string().uuid("Select a client"),
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().max(5000).optional().or(z.literal("")),
  status: z
    .enum(["planning", "active", "on_hold", "completed", "cancelled"])
    .default("planning"),
  start_date: z.string().optional().or(z.literal("")),
  due_date: z.string().optional().or(z.literal("")),
  budget: z.coerce.number().nonnegative().optional().nullable(),
  progress: z.coerce.number().min(0).max(100).default(0),
});
export type ProjectInput = z.infer<typeof projectSchema>;

export const taskSchema = z.object({
  project_id: z.string().uuid(),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(5000).optional().or(z.literal("")),
  status: z
    .enum(["todo", "in_progress", "review", "completed"])
    .default("todo"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  due_date: z.string().optional().or(z.literal("")),
});
export type TaskInput = z.infer<typeof taskSchema>;
