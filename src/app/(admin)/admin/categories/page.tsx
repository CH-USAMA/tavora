import { db } from "@/shared/lib/db";
import { categories } from "@/shared/lib/db/schema";
import { AddCategoryDialog } from "@/features/categories/components/AddCategoryDialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";

export default async function AdminCategoriesPage() {
    const allCategories = await db.select().from(categories).orderBy(categories.sortOrder);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white font-serif">Categories</h2>
                <AddCategoryDialog />
            </div>

            <div className="bg-gunmetal rounded-md border border-warm-gray/10">
                <Table>
                    <TableHeader>
                        <TableRow className="border-warm-gray/10 hover:bg-transparent">
                            <TableHead className="text-warm-gray">Name</TableHead>
                            <TableHead className="text-warm-gray">Slug</TableHead>
                            <TableHead className="text-warm-gray text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allCategories.length === 0 ? (
                            <TableRow className="border-warm-gray/10 hover:bg-white/5">
                                <TableCell colSpan={3} className="h-24 text-center text-warm-gray">
                                    No categories yet. Add your first category!
                                </TableCell>
                            </TableRow>
                        ) : (
                            allCategories.map((cat) => (
                                <TableRow key={cat.id} className="border-warm-gray/10 hover:bg-white/5">
                                    <TableCell className="font-medium text-white">{cat.name}</TableCell>
                                    <TableCell className="text-warm-gray">{cat.slug}</TableCell>
                                    <TableCell className="text-right">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cat.isVisible ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                            {cat.isVisible ? 'Visible' : 'Hidden'}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
