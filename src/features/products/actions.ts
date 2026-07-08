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
export async function updateProductAction(id: string, data: CreateProductInput) {
    try {
        const product = await ProductService.updateProduct(id, data);
        revalidatePath("/admin/products");
        revalidatePath(`/product/${product.slug}`);
        return { success: true, product };
    } catch (error: any) {
        console.error("Failed to update product:", error);
        return { success: false, error: error.message };
    }
}
