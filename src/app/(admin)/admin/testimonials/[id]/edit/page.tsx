import { TestimonialForm } from "@/features/testimonials/components/TestimonialForm";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { db } from "@/shared/lib/db";
import { notFound } from "next/navigation";
import { testimonials } from "@/shared/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const testimonial = await db.query.testimonials.findFirst({
        where: eq(testimonials.id, id)
    });

    if (!testimonial) {
        notFound();
    }

    const initialData = {
        name: testimonial.name,
        role: testimonial.role || "",
        content: testimonial.content,
        avatar: testimonial.avatar || "",
        rating: testimonial.rating ?? 5,
        isVisible: testimonial.isVisible ?? true,
        sortOrder: testimonial.sortOrder ?? 0
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="hover:bg-charcoal text-warm-gray">
                    <Link href="/admin/testimonials"><ArrowLeft className="w-4 h-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-serif text-white">Edit Testimonial</h1>
                    <p className="text-warm-gray mt-1 text-sm">Update this testimonial.</p>
                </div>
            </div>

            <TestimonialForm initialData={initialData} testimonialId={testimonial.id} />
        </div>
    );
}
