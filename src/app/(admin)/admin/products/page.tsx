import { db } from "@/shared/lib/db";
import { products } from "@/shared/lib/db/schema";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { DeleteProductButton } from "@/features/products/components/DeleteProductButton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";

export default async function AdminProductsPage() {
    const allProducts = await db.select().from(products);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white font-serif">Products</h2>
                <Button asChild className="bg-gold text-black hover:bg-gold-light">
                    <Link href="/admin/products/new">
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Link>
                </Button>
            </div>

            <div className="bg-gunmetal rounded-md border border-warm-gray/10">
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
    );
}
