import { z } from "zod";

export const sectionTypes = ["hero", "about", "text_banner", "featured_products", "custom"] as const;

export const createHomepageSectionSchema = z.object({
    type: z.enum(sectionTypes),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    image: z.string().optional(),
    buttonText: z.string().optional(),
    buttonLink: z.string().optional(),
    sortOrder: z.coerce.number().default(0),
    isVisible: z.boolean().default(true),
});

export type CreateHomepageSectionInput = z.infer<typeof createHomepageSectionSchema>;

export const sectionTypeLabels: Record<(typeof sectionTypes)[number], string> = {
    hero: "Hero Banner",
    about: "About / Story",
    text_banner: "Text Banner",
    featured_products: "Featured Products",
    custom: "Custom",
};
