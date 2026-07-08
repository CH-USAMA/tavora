import { db } from "@/shared/lib/db";
import { products, productImages } from "@/shared/lib/db/schema";
import { CreateProductInput } from "./types";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export class ProductRepository {
    static async create(data: CreateProductInput & { slug: string; id: string }) {
        const sanitizedData = {
            ...data,
            salePrice: data.salePrice === "" ? undefined : data.salePrice,
            sku: data.sku === "" ? undefined : data.sku,
            externalUrl: data.externalUrl === "" ? undefined : data.externalUrl,
            imageUrl: data.images && data.images.length > 0 ? data.images[0] : undefined,
        };
        
        // Remove images from sanitizedData before inserting into products
        const { images, ...productDataToInsert } = sanitizedData;
        
        const [product] = await db.insert(products).values({
            ...productDataToInsert,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning();
        
        if (images && images.length > 0) {
            const imagesToInsert = images.map((url, idx) => ({
                id: randomUUID(),
                productId: product.id,
                url,
                sortOrder: idx,
                isPrimary: idx === 0
            }));
            await db.insert(productImages).values(imagesToInsert);
        }
        
        return product;
    }

    static async findAll() {
        return db.select().from(products).orderBy(products.createdAt);
    }
}
