"use server";

import { db } from "@/shared/lib/db";
import { categories } from "@/shared/lib/db/schema";
import { eq } from "drizzle-orm";
import { createCategorySchema, CreateCategoryInput } from "./types";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(data: CreateCategoryInput) {
    try {
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
        await db.delete(categories).where(eq(categories.id, id));
        revalidatePath("/admin/categories");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
