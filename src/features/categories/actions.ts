"use server";

import { db } from "@/shared/lib/db";
import { categories, products } from "@/shared/lib/db/schema";
import { eq, count } from "drizzle-orm";
import { createCategorySchema, CreateCategoryInput } from "./types";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/shared/lib/auth/require-admin";

export async function createCategoryAction(data: CreateCategoryInput) {
    try {
        await requireAdmin();
        const validated = createCategorySchema.parse(data);
        const id = crypto.randomUUID();

        await db.insert(categories).values({
            id,
            ...validated,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        revalidatePath("/admin/categories");
        return { success: true, id };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateCategoryAction(id: string, data: CreateCategoryInput) {
    try {
        await requireAdmin();
        const validated = createCategorySchema.parse(data);

        await db.update(categories).set({
            ...validated,
            updatedAt: new Date()
        }).where(eq(categories.id, id));

        revalidatePath("/admin/categories");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteCategoryAction(id: string) {
    try {
        await requireAdmin();

        const [{ value: productCount }] = await db
            .select({ value: count() })
            .from(products)
            .where(eq(products.categoryId, id));

        if (productCount > 0) {
            return {
                success: false,
                error: `Cannot delete this category — ${productCount} product${productCount === 1 ? "" : "s"} still assigned to it. Reassign or delete those products first.`,
            };
        }

        await db.delete(categories).where(eq(categories.id, id));
        revalidatePath("/admin/categories");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
