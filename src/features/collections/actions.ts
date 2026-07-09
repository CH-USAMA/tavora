"use server";

import { db } from "@/shared/lib/db";
import { collections, products } from "@/shared/lib/db/schema";
import { eq, count } from "drizzle-orm";
import { createCollectionSchema, CreateCollectionInput } from "./types";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/shared/lib/auth/require-admin";

export async function createCollectionAction(data: CreateCollectionInput) {
    try {
        await requireAdmin();
        const validated = createCollectionSchema.parse(data);
        const id = crypto.randomUUID();

        await db.insert(collections).values({
            id,
            ...validated,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        revalidatePath("/admin/collections");
        return { success: true, id };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateCollectionAction(id: string, data: CreateCollectionInput) {
    try {
        await requireAdmin();
        const validated = createCollectionSchema.parse(data);

        await db.update(collections).set({
            ...validated,
            updatedAt: new Date()
        }).where(eq(collections.id, id));

        revalidatePath("/admin/collections");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteCollectionAction(id: string) {
    try {
        await requireAdmin();

        const [{ value: productCount }] = await db
            .select({ value: count() })
            .from(products)
            .where(eq(products.collectionId, id));

        if (productCount > 0) {
            return {
                success: false,
                error: `Cannot delete this collection — ${productCount} product${productCount === 1 ? "" : "s"} still assigned to it. Reassign or delete those products first.`,
            };
        }

        await db.delete(collections).where(eq(collections.id, id));
        revalidatePath("/admin/collections");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
