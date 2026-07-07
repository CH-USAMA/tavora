"use server";

import { revalidatePath } from "next/cache";
import { ProductService } from "./service";
import { CreateProductInput } from "./types";

export async function createProductAction(data: CreateProductInput) {
    try {
        const product = await ProductService.createProduct(data);
        revalidatePath("/admin/products");
        return { success: true, product };
    } catch (error: any) {
        console.error("Failed to create product:", error);
        return { success: false, error: error.message };
    }
}
