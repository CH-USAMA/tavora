import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { db } from "@/shared/lib/db";
import { categories, collections } from "@/shared/lib/db/schema";
import { asc } from "drizzle-orm";
import { BulkImportForm } from "@/features/products/components/BulkImportForm";

export const dynamic = "force-dynamic";

export default async function BulkUploadProductsPage() {
    const allCategories = await db.query.categories.findMany({ orderBy: [asc(categories.name)] });
    const allCollections = await db.query.collections.findMany({ orderBy: [asc(collections.name)] });

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="hover:bg-charcoal text-warm-gray shrink-0">
                    <Link href="/admin/products"><ArrowLeft className="w-4 h-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-serif text-white">Bulk Import Products</h1>
                    <p className="text-warm-gray mt-2 text-sm">Upload a CSV file to add multiple products at once.</p>
                </div>
            </div>

            <BulkImportForm categories={allCategories} collections={allCollections} />
        </div>
    );
}
