"use server";

import { revalidatePath } from "next/cache";
import { SettingsService } from "./service";
import { SiteSettings } from "./types";
import { requireAdmin } from "@/shared/lib/auth/require-admin";

export async function updateSiteSettingsAction(data: SiteSettings) {
    try {
        await requireAdmin();
        await SettingsService.updateSiteSettings(data);
        revalidatePath("/admin/settings");
        revalidatePath("/", "layout");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
