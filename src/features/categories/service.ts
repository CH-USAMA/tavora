import { CategoryRepository } from "./repository";
import { CreateCategoryInput, createCategorySchema } from "./types";
import crypto from "crypto";

export class CategoryService {
    static async createCategory(input: CreateCategoryInput) {
        const parsed = createCategorySchema.safeParse(input);
        if (!parsed.success) {
            throw new Error("Invalid category data");
        }

        const data = parsed.data;
        const slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");

        const id = crypto.randomUUID();

        return CategoryRepository.create({ ...data, slug, id });
    }

    static async deleteCategory(id: string) {
        return CategoryRepository.delete(id);
    }
}
