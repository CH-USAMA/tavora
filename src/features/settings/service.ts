import { db } from "@/shared/lib/db";
import { settings } from "@/shared/lib/db/schema";
import { eq } from "drizzle-orm";
import { defaultSiteSettings, SITE_SETTINGS_KEY, SiteSettings, siteSettingsSchema } from "./types";

export class SettingsService {
    static async getSiteSettings(): Promise<SiteSettings> {
        const row = await db.query.settings.findFirst({ where: eq(settings.key, SITE_SETTINGS_KEY) });
        if (!row || !row.value) return defaultSiteSettings;
        return { ...defaultSiteSettings, ...(row.value as Partial<SiteSettings>) };
    }

    static async updateSiteSettings(input: SiteSettings) {
        const parsed = siteSettingsSchema.safeParse(input);
        if (!parsed.success) {
            throw new Error("Invalid settings data");
        }

        await db.insert(settings).values({
            id: crypto.randomUUID(),
            key: SITE_SETTINGS_KEY,
            value: parsed.data,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).onConflictDoUpdate({
            target: settings.key,
            set: { value: parsed.data, updatedAt: new Date() },
        });

        return parsed.data;
    }
}
