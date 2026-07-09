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
            categoryId: data.categoryId === "" ? undefined : data.categoryId,
            collectionId: data.collectionId === "" ? undefined : data.collectionId,
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

    static async findById(id: string) {
        const product = await db.select().from(products).where(eq(products.id, id)).get();
        if (!product) return null;
        
        const images = await db.select().from(productImages).where(eq(productImages.productId, id));
        images.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        
        return {
            ...product,
            images: images.length > 0 ? images.map(i => i.url) : (product.imageUrl ? [product.imageUrl] : []),
        };
    }

    static async update(id: string, data: CreateProductInput & { slug?: string }) {
        const sanitizedData = {
            ...data,
            salePrice: data.salePrice === "" ? null : data.salePrice,
            sku: data.sku === "" ? null : data.sku,
            externalUrl: data.externalUrl === "" ? null : data.externalUrl,
            categoryId: data.categoryId === "" ? null : data.categoryId,
            collectionId: data.collectionId === "" ? null : data.collectionId,
            imageUrl: data.images && data.images.length > 0 ? data.images[0] : null,
        };
        
        const { images, ...productDataToUpdate } = sanitizedData;
        
        const [product] = await db.update(products).set({
            ...productDataToUpdate,
            updatedAt: new Date(),
        }).where(eq(products.id, id)).returning();
        
        if (images !== undefined) {
            // Delete old images
            await db.delete(productImages).where(eq(productImages.productId, id));
            // Insert new images
            if (images.length > 0) {
                const imagesToInsert = images.map((url, idx) => ({
                    id: randomUUID(),
                    productId: id,
                    url,
                    sortOrder: idx,
                    isPrimary: idx === 0
                }));
                await db.insert(productImages).values(imagesToInsert);
            }
        }
        
        return product;
    }

    static async delete(id: string) {
        await db.delete(productImages).where(eq(productImages.productId, id));
        const [product] = await db.delete(products).where(eq(products.id, id)).returning();
        return product;
    }

    static async findAll() {
        return db.select().from(products).orderBy(products.createdAt);
    }
}
