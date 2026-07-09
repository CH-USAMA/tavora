import { TestimonialForm } from "@/features/testimonials/components/TestimonialForm";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewTestimonialPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="hover:bg-charcoal text-warm-gray">
                    <Link href="/admin/testimonials"><ArrowLeft className="w-4 h-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-serif text-white">New Testimonial</h1>
                    <p className="text-warm-gray mt-1 text-sm">Add a customer testimonial.</p>
                </div>
            </div>

            <TestimonialForm />
        </div>
    );
}
