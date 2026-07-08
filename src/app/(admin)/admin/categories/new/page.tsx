import { CategoryForm } from "@/features/categories/components/CategoryForm";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewCategoryPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="hover:bg-charcoal text-warm-gray">
                    <Link href="/admin/categories"><ArrowLeft className="w-4 h-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-serif text-white">New Category</h1>
                    <p className="text-warm-gray mt-1 text-sm">Create a new product category.</p>
                </div>
            </div>

            <CategoryForm />
        </div>
    );
}
