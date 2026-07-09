import { ProductForm } from "@/features/products/components/ProductForm";
import { ProductService } from "@/features/products/service";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { notFound } from "next/navigation";
import { db } from "@/shared/lib/db";
import { categories, collections } from "@/shared/lib/db/schema";
import { asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const p = await params;
    const product = await ProductService.getProduct(p.id);
    
    if (!product) {
        notFound();
    }

    const allCategories = await db.query.categories.findMany({
        orderBy: [asc(categories.name)]
    });
    const allCollections = await db.query.collections.findMany({
        orderBy: [asc(collections.name)]
    });

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 mb-8">
                <Button variant="outline" size="icon" asChild className="border-warm-gray/20 text-warm-gray hover:bg-white/5 hover:text-white">
                    <Link href="/admin/products">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-2xl font-bold text-white font-serif">Edit Product</h2>
                    <p className="text-sm text-warm-gray">Update existing product information</p>
                </div>
            </div>

            <div className="bg-gunmetal p-6 rounded-lg shadow-md border border-warm-gray/10">
                <ProductForm initialData={product as any} productId={product.id} categories={allCategories} collections={allCollections} />
            </div>
        </div>
    );
}
