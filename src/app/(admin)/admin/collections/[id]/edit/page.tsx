import { CollectionForm } from "@/features/collections/components/CollectionForm";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { db } from "@/shared/lib/db";
import { notFound } from "next/navigation";
import { collections } from "@/shared/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function EditCollectionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const collection = await db.query.collections.findFirst({
        where: eq(collections.id, id)
    });

    if (!collection) {
        notFound();
    }

    const initialData = {
        name: collection.name,
        slug: collection.slug,
        description: collection.description || "",
        image: collection.image || "",
        isVisible: collection.isVisible ?? true,
        sortOrder: collection.sortOrder ?? 0
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="hover:bg-charcoal text-warm-gray">
                    <Link href="/admin/collections"><ArrowLeft className="w-4 h-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-serif text-white">Edit Collection</h1>
                    <p className="text-warm-gray mt-1 text-sm">Update the properties of this collection.</p>
                </div>
            </div>

            <CollectionForm initialData={initialData} collectionId={collection.id} />
        </div>
    );
}
