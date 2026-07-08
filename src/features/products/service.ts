import { ProductRepository } from "./repository";
import { CreateProductInput, createProductSchema } from "./types";
import crypto from "crypto";

export class ProductService {
    static async createProduct(input: CreateProductInput) {
        // Validate input
        const parsed = createProductSchema.safeParse(input);
        if (!parsed.success) {
            throw new Error("Invalid product data");
        }

        const data = parsed.data;

        // Generate slug from title
        const slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")
            + "-" + crypto.randomBytes(3).toString("hex");

        const id = crypto.randomUUID();

        // Call repository
        const product = await ProductRepository.create({
            ...data,
            slug,
            id,
        });

        return product;
    }

    static async getProduct(id: string) {
        return await ProductRepository.findById(id);
    }

    static async updateProduct(id: string, input: CreateProductInput) {
        const parsed = createProductSchema.safeParse(input);
        if (!parsed.success) {
            throw new Error("Invalid product data");
        }

        const data = parsed.data;

        let slug: string | undefined = undefined;
        if (data.title) {
            slug = data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "")
                + "-" + crypto.randomBytes(3).toString("hex");
        }

        const product = await ProductRepository.update(id, {
            ...data,
            slug,
        });

        return product;
    }

    static async deleteProduct(id: string) {
        return await ProductRepository.delete(id);
    }
}
