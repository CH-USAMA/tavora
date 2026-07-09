import { db } from "@/shared/lib/db";
import { products, categories, collections, testimonials, settings, orders } from "@/shared/lib/db/schema";
import { count, eq, desc } from "drizzle-orm";
import Link from "next/link";
import { Package, Eye, EyeOff, Folders, Layers, Star, Plus, CheckCircle2, Circle, ShoppingBag, Clock } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
    const [
        [{ value: totalProducts }],
        [{ value: visibleProducts }],
        [{ value: categoryCount }],
        [{ value: collectionCount }],
        [{ value: testimonialCount }],
        [{ value: totalOrders }],
        [{ value: pendingOrders }],
        siteSettingsRow,
        recentProducts,
    ] = await Promise.all([
        db.select({ value: count() }).from(products),
        db.select({ value: count() }).from(products).where(eq(products.isVisible, true)),
        db.select({ value: count() }).from(categories),
        db.select({ value: count() }).from(collections),
        db.select({ value: count() }).from(testimonials),
        db.select({ value: count() }).from(orders),
        db.select({ value: count() }).from(orders).where(eq(orders.status, "pending")),
        db.query.settings.findFirst({ where: eq(settings.key, "site") }),
        db.select().from(products).orderBy(desc(products.createdAt)).limit(5),
    ]);

    const draftProducts = totalProducts - visibleProducts;

    const stats = [
        { name: "Pending Orders", value: pendingOrders, icon: Clock, href: "/admin/orders" },
        { name: "Total Orders", value: totalOrders, icon: ShoppingBag, href: "/admin/orders" },
        { name: "Total Products", value: totalProducts, icon: Package, href: "/admin/products" },
        { name: "Live Products", value: visibleProducts, icon: Eye, href: "/admin/products" },
        { name: "Draft Products", value: draftProducts, icon: EyeOff, href: "/admin/products" },
        { name: "Categories", value: categoryCount, icon: Folders, href: "/admin/categories" },
        { name: "Collections", value: collectionCount, icon: Layers, href: "/admin/collections" },
        { name: "Testimonials", value: testimonialCount, icon: Star, href: "/admin/testimonials" },
    ];

    const checklist = [
        { label: "Add your first product", done: totalProducts > 0, href: "/admin/products/new" },
        { label: "Create a category", done: categoryCount > 0, href: "/admin/categories/new" },
        { label: "Configure WhatsApp & site settings", done: !!siteSettingsRow, href: "/admin/settings" },
        { label: "Add a customer testimonial", done: testimonialCount > 0, href: "/admin/testimonials/new" },
    ];

    const quickActions = [
        { label: "View Orders", href: "/admin/orders" },
        { label: "Add Product", href: "/admin/products/new" },
        { label: "Add Category", href: "/admin/categories/new" },
        { label: "Add Collection", href: "/admin/collections/new" },
        { label: "Add Testimonial", href: "/admin/testimonials/new" },
        { label: "Site Settings", href: "/admin/settings" },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {stats.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="p-5 bg-gunmetal rounded-lg shadow-md border border-warm-gray/10 hover:border-gold/30 transition-colors"
                    >
                        <item.icon className="h-5 w-5 text-gold mb-3" />
                        <p className="text-2xl font-semibold text-white">{item.value}</p>
                        <h3 className="mt-1 text-xs text-warm-gray">{item.name}</h3>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Products */}
                <div className="lg:col-span-2 bg-gunmetal rounded-lg shadow-md border border-warm-gray/10 overflow-hidden">
                    <div className="flex items-center justify-between p-6 pb-4">
                        <h3 className="text-lg font-medium text-white">Recent Products</h3>
                        <Button asChild variant="ghost" size="sm" className="text-warm-gray hover:text-gold hover:bg-transparent">
                            <Link href="/admin/products">View all</Link>
                        </Button>
                    </div>
                    {recentProducts.length === 0 ? (
                        <p className="px-6 pb-6 text-sm text-warm-gray">No products yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-warm-gray/10 hover:bg-transparent">
                                        <TableHead className="text-warm-gray">Title</TableHead>
                                        <TableHead className="text-warm-gray">Price</TableHead>
                                        <TableHead className="text-warm-gray text-right">Status</TableHead>
                                        <TableHead className="text-warm-gray text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentProducts.map((product) => (
                                        <TableRow key={product.id} className="border-warm-gray/10 hover:bg-white/5">
                                            <TableCell className="font-medium text-white">{product.title}</TableCell>
                                            <TableCell className="text-warm-gray">Rs. {product.price.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.isVisible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {product.isVisible ? 'Active' : 'Draft'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button asChild variant="ghost" size="sm" className="text-warm-gray hover:text-gold hover:bg-transparent">
                                                    <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>

                {/* Setup Checklist */}
                <div className="bg-gunmetal rounded-lg shadow-md border border-warm-gray/10 p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Setup Checklist</h3>
                    <ul className="space-y-3">
                        {checklist.map((item) => (
                            <li key={item.label}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 text-sm transition-colors ${item.done ? 'text-warm-gray' : 'text-white hover:text-gold'}`}
                                >
                                    {item.done ? (
                                        <CheckCircle2 className="h-4 w-4 text-gold shrink-0" />
                                    ) : (
                                        <Circle className="h-4 w-4 text-warm-gray/40 shrink-0" />
                                    )}
                                    <span className={item.done ? 'line-through' : ''}>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gunmetal rounded-lg shadow-md border border-warm-gray/10 p-6">
                <h3 className="text-lg font-medium text-white mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                    {quickActions.map((action) => (
                        <Button key={action.label} asChild variant="outline" className="border-warm-gray/20 text-warm-gray hover:text-gold hover:border-gold/40">
                            <Link href={action.href}>
                                <Plus className="mr-2 h-4 w-4" /> {action.label}
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}
