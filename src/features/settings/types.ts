import { z } from "zod";

export const siteSettingsSchema = z.object({
    siteName: z.string().min(1, "Site name is required").default("Tavora"),
    siteEmail: z.string().email("Must be a valid email").optional().or(z.literal('')),
    sitePhone: z.string().optional(),
    whatsappNumber: z.string().min(6, "WhatsApp number is required"),
    whatsappMessage: z.string().optional(),
    address: z.string().optional(),
    facebookUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
    instagramUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
    tiktokUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;

export const defaultSiteSettings: SiteSettings = {
    siteName: "Tavora",
    siteEmail: "info@tavora.com",
    sitePhone: "",
    whatsappNumber: "923144293848",
    whatsappMessage: "Hi! I'm interested in one of your luxury timepieces from Tavora. Could you help me?",
    address: "",
    facebookUrl: "",
    instagramUrl: "",
    tiktokUrl: "",
};

export const SITE_SETTINGS_KEY = "site";
