import { ProductForm } from "@/features/products/components/ProductForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { db } from "@/shared/lib/db";
import { categories } from "@/shared/lib/db/schema";
import { asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function AddProductPage() {
    const allCategories = await db.query.categories.findMany({
        orderBy: [asc(categories.name)]
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
                    <h2 className="text-2xl font-bold text-white font-serif">Add New Product</h2>
                    <p className="text-sm text-warm-gray">Create a new product listing in your store</p>
                </div>
            </div>

            <div className="bg-gunmetal p-6 rounded-lg shadow-md border border-warm-gray/10">
                <ProductForm categories={allCategories} />
            </div>
        </div>
    );
}
