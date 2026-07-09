"use server";

import { list, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/shared/lib/auth/require-admin";

export async function listMediaAction(cursor?: string) {
    try {
        await requireAdmin();
        const result = await list({ limit: 60, cursor });
        return {
            success: true,
            blobs: result.blobs.map(b => ({
                url: b.url,
                pathname: b.pathname,
                size: b.size,
                uploadedAt: b.uploadedAt.toISOString(),
            })),
            cursor: result.cursor,
            hasMore: result.hasMore,
        };
    } catch (error: any) {
        return { success: false, error: error.message, blobs: [], hasMore: false };
    }
}

export async function deleteMediaAction(url: string) {
    try {
        await requireAdmin();
        await del(url);
        revalidatePath("/admin/media");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
