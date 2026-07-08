import { CategoryForm } from "@/features/categories/components/CategoryForm";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { db } from "@/shared/lib/db";
import { notFound } from "next/navigation";
import { categories } from "@/shared/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
    const category = await db.query.categories.findFirst({
        where: eq(categories.id, params.id)
    });

    if (!category) {
        notFound();
    }

    const initialData = {
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        image: category.image || "",
        isVisible: category.isVisible ?? true,
        sortOrder: category.sortOrder ?? 0
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="hover:bg-charcoal text-warm-gray">
                    <Link href="/admin/categories"><ArrowLeft className="w-4 h-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-serif text-white">Edit Category</h1>
                    <p className="text-warm-gray mt-1 text-sm">Update the properties of this category.</p>
                </div>
            </div>

            <CategoryForm initialData={initialData} categoryId={category.id} />
        </div>
    );
}
