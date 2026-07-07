import { MetadataRoute } from 'next'
import { db } from "@/shared/lib/db";
import { products, categories } from "@/shared/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tavora.com';

  // Fetch all active products
  const activeProducts = await db
    .select()
    .from(products)
    .where(eq(products.isVisible, true));

  // Fetch all active categories
  const activeCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.isVisible, true));

  const productUrls = activeProducts.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const categoryUrls = activeCategories.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...productUrls,
    ...categoryUrls,
  ]
}
