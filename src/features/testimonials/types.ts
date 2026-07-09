import { z } from "zod";

export const createTestimonialSchema = z.object({
    name: z.string().min(1, "Name is required"),
    role: z.string().optional(),
    content: z.string().min(1, "Testimonial content is required"),
    avatar: z.string().optional(),
    rating: z.coerce.number().min(1).max(5).default(5),
    isVisible: z.boolean().default(true),
    sortOrder: z.coerce.number().default(0),
});

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
