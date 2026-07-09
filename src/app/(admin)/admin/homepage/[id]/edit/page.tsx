import { HomepageSectionForm } from "@/features/homepage/components/HomepageSectionForm";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { db } from "@/shared/lib/db";
import { notFound } from "next/navigation";
import { homepageSections } from "@/shared/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function EditHomepageSectionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const section = await db.query.homepageSections.findFirst({
        where: eq(homepageSections.id, id)
    });

    if (!section) {
        notFound();
    }

    const config = (section.config as { image?: string; buttonText?: string; buttonLink?: string } | null) || {};

    const initialData = {
        type: section.type as any,
        title: section.title || "",
        subtitle: section.subtitle || "",
        image: config.image || "",
        buttonText: config.buttonText || "",
        buttonLink: config.buttonLink || "",
        sortOrder: section.sortOrder ?? 0,
        isVisible: section.isVisible ?? true,
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="hover:bg-charcoal text-warm-gray">
                    <Link href="/admin/homepage"><ArrowLeft className="w-4 h-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-serif text-white">Edit Section</h1>
                    <p className="text-warm-gray mt-1 text-sm">Update this homepage section.</p>
                </div>
            </div>

            <HomepageSectionForm initialData={initialData} sectionId={section.id} />
        </div>
    );
}
