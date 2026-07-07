"use server";

import { revalidatePath } from "next/cache";
import { CategoryService } from "./service";
import { CreateCategoryInput } from "./types";

export async function createCategoryAction(data: CreateCategoryInput) {
    try {
        const category = await CategoryService.createCategory(data);
        revalidatePath("/admin/categories");
        return { success: true, category };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteCategoryAction(id: string) {
    try {
        await CategoryService.deleteCategory(id);
        revalidatePath("/admin/categories");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
