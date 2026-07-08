import { db } from "@/shared/lib/db";
import { products } from "@/shared/lib/db/schema";
import { CreateProductInput } from "./types";
import { eq } from "drizzle-orm";

export class ProductRepository {
    static async create(data: CreateProductInput & { slug: string; id: string }) {
        const sanitizedData = {
            ...data,
            salePrice: data.salePrice === "" ? undefined : data.salePrice,
            sku: data.sku === "" ? undefined : data.sku,
            externalUrl: data.externalUrl === "" ? undefined : data.externalUrl,
            imageUrl: data.imageUrl === "" ? undefined : data.imageUrl,
        };
        const [product] = await db.insert(products).values({
            ...sanitizedData,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning();
        return product;
    }

    static async findAll() {
        return db.select().from(products).orderBy(products.createdAt);
    }
}
