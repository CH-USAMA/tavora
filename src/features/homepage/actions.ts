"use server";

import { db } from "@/shared/lib/db";
import { homepageSections } from "@/shared/lib/db/schema";
import { eq } from "drizzle-orm";
import { createHomepageSectionSchema, CreateHomepageSectionInput } from "./types";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/shared/lib/auth/require-admin";

function toRow(data: CreateHomepageSectionInput) {
    const { image, buttonText, buttonLink, ...rest } = data;
    return {
        ...rest,
        config: { image, buttonText, buttonLink },
    };
}

export async function createHomepageSectionAction(data: CreateHomepageSectionInput) {
    try {
        await requireAdmin();
        const validated = createHomepageSectionSchema.parse(data);
        const id = crypto.randomUUID();

        await db.insert(homepageSections).values({
            id,
            ...toRow(validated),
            createdAt: new Date(),
            updatedAt: new Date()
        });

        revalidatePath("/admin/homepage");
        return { success: true, id };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateHomepageSectionAction(id: string, data: CreateHomepageSectionInput) {
    try {
        await requireAdmin();
        const validated = createHomepageSectionSchema.parse(data);

        await db.update(homepageSections).set({
            ...toRow(validated),
            updatedAt: new Date()
        }).where(eq(homepageSections.id, id));

        revalidatePath("/admin/homepage");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteHomepageSectionAction(id: string) {
    try {
        await requireAdmin();
        await db.delete(homepageSections).where(eq(homepageSections.id, id));
        revalidatePath("/admin/homepage");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
