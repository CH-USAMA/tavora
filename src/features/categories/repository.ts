import { db } from "@/shared/lib/db";
import { categories } from "@/shared/lib/db/schema";
import { CreateCategoryInput } from "./types";
import { eq } from "drizzle-orm";

export class CategoryRepository {
    static async create(data: CreateCategoryInput & { slug: string; id: string }) {
        const [category] = await db.insert(categories).values({
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning();
        return category;
    }

    static async findAll() {
        return db.select().from(categories).orderBy(categories.sortOrder);
    }

    static async findById(id: string) {
        const [category] = await db.select().from(categories).where(eq(categories.id, id));
        return category;
    }

    static async delete(id: string) {
        await db.delete(categories).where(eq(categories.id, id));
    }
}
