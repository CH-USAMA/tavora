import { z } from "zod";

export const createCollectionSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().optional(),
    image: z.string().optional(),
    isVisible: z.boolean().default(true),
    sortOrder: z.coerce.number().default(0)
});

export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
