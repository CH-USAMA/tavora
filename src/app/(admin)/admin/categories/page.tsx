import { db } from "@/shared/lib/db";
import { categories } from "@/shared/lib/db/schema";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { DeleteCategoryButton } from "@/features/categories/components/DeleteCategoryButton";
import { desc } from "drizzle-orm";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import Image from "next/image";

export default async function AdminCategoriesPage() {
    const allCategories = await db.query.categories.findMany({
        orderBy: [desc(categories.sortOrder), desc(categories.createdAt)],
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-white font-serif">Categories</h2>
                <Button asChild className="bg-gold text-black hover:bg-gold-light w-full sm:w-auto">
                    <Link href="/admin/categories/new">
                        <Plus className="mr-2 h-4 w-4" /> Add Category
                    </Link>
                </Button>
            </div>

            <div className="bg-gunmetal rounded-md border border-warm-gray/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-warm-gray/10 hover:bg-transparent">
                                <TableHead className="text-warm-gray w-16">Image</TableHead>
                                <TableHead className="text-warm-gray">Name</TableHead>
                                <TableHead className="text-warm-gray">Slug</TableHead>
                                <TableHead className="text-warm-gray text-right">Order</TableHead>
                                <TableHead className="text-warm-gray text-right">Status</TableHead>
                                <TableHead className="text-warm-gray text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allCategories.length === 0 ? (
                                <TableRow className="border-warm-gray/10 hover:bg-white/5">
                                    <TableCell colSpan={6} className="h-24 text-center text-warm-gray">
                                        No categories found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                allCategories.map((category) => (
                                    <TableRow key={category.id} className="border-warm-gray/10 hover:bg-white/5">
                                        <TableCell>
                                            <div className="h-10 w-10 relative rounded overflow-hidden bg-charcoal border border-warm-gray/20">
                                                {category.image && (
                                                    <Image src={category.image} alt={category.name} fill className="object-cover" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium text-white">{category.name}</TableCell>
                                        <TableCell className="text-warm-gray font-mono text-sm">{category.slug}</TableCell>
                                        <TableCell className="text-warm-gray text-right">{category.sortOrder}</TableCell>
                                        <TableCell className="text-right">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category.isVisible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {category.isVisible ? 'Visible' : 'Hidden'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button asChild variant="ghost" size="sm" className="text-warm-gray hover:text-gold hover:bg-transparent">
                                                    <Link href={`/admin/categories/${category.id}/edit`}>Edit</Link>
                                                </Button>
                                                <DeleteCategoryButton id={category.id} name={category.name} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
