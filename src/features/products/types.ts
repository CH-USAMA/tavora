import { z } from "zod";

export const createProductSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  sku: z.string().min(3, "SKU is required").optional().or(z.literal('')),
  price: z.coerce.number().min(0, "Price must be positive"),
  salePrice: z.coerce.number().min(0).optional().or(z.literal('')),
  description: z.string().optional(),
  brand: z.string().optional(),
  externalUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  images: z.array(z.string()).default([]),
  categoryId: z.string().optional().nullable(),
  isVisible: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
