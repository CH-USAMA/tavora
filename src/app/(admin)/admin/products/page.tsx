import { db } from "@/shared/lib/db";
import { products } from "@/shared/lib/db/schema";
import { Plus } from "lucide-react";
import Link from "next/link";
import { desc, count } from "drizzle-orm";
import { Button } from "@/shared/components/ui/button";
import { DeleteProductButton } from "@/features/products/components/DeleteProductButton";
import { Pagination } from "@/shared/components/Pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const sp = await searchParams;
    const currentPage = Math.max(1, parseInt(sp.page || '1', 10) || 1);

    const [allProducts, [{ value: totalCount }]] = await Promise.all([
        db.select().from(products).orderBy(desc(products.createdAt)).limit(PAGE_SIZE).offset((currentPage - 1) * PAGE_SIZE),
        db.select({ value: count() }).from(products),
    ]);
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-white font-serif">Products</h2>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button asChild variant="outline" className="border-warm-gray/20 text-warm-gray hover:text-white flex-1 sm:flex-none">
                        <Link href="/admin/products/bulk">
                            Bulk Import
                        </Link>
                    </Button>
                    <Button asChild className="bg-gold text-black hover:bg-gold-light flex-1 sm:flex-none">
                        <Link href="/admin/products/new">
                            <Plus className="mr-2 h-4 w-4" /> Add Product
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="bg-gunmetal rounded-md border border-warm-gray/10 overflow-hidden">
                <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-warm-gray/10 hover:bg-transparent">
                            <TableHead className="text-warm-gray">Title</TableHead>
                            <TableHead className="text-warm-gray">SKU</TableHead>
                            <TableHead className="text-warm-gray">Price</TableHead>
                            <TableHead className="text-warm-gray text-right">Status</TableHead>
                            <TableHead className="text-warm-gray text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allProducts.length === 0 ? (
                            <TableRow className="border-warm-gray/10 hover:bg-white/5">
                                <TableCell colSpan={4} className="h-24 text-center text-warm-gray">
                                    No products found. Add your first product!
                                </TableCell>
                            </TableRow>
                        ) : (
                            allProducts.map((product) => (
                                <TableRow key={product.id} className="border-warm-gray/10 hover:bg-white/5">
                                    <TableCell className="font-medium text-white">{product.title}</TableCell>
                                    <TableCell className="text-warm-gray">{product.sku}</TableCell>
                                    <TableCell className="text-warm-gray">Rs. {product.price}</TableCell>
                                    <TableCell className="text-right">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.isVisible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {product.isVisible ? 'Active' : 'Draft'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button asChild variant="ghost" size="sm" className="text-warm-gray hover:text-gold hover:bg-transparent">
                                                <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                                            </Button>
                                            <DeleteProductButton id={product.id} productName={product.title} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                </div>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                buildHref={(page) => page > 1 ? `/admin/products?page=${page}` : "/admin/products"}
                className="pt-2"
            />
        </div>
    );
}
