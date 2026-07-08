import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  isVisible: z.boolean(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
