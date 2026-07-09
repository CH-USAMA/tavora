import { db } from "@/shared/lib/db";
import { orders, orderItems } from "@/shared/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { OrderStatusSelect } from "@/features/orders/components/OrderStatusSelect";
import { OrderStatus } from "@/features/orders/types";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const order = await db.query.orders.findFirst({ where: eq(orders.id, id) });
    if (!order) notFound();

    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="hover:bg-charcoal text-warm-gray">
                    <Link href="/admin/orders"><ArrowLeft className="w-4 h-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-serif text-white">{order.orderNumber}</h1>
                    <p className="text-warm-gray mt-1 text-sm">Placed {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="ml-auto">
                    <OrderStatusSelect orderId={order.id} status={order.status as OrderStatus} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gunmetal rounded-lg border border-warm-gray/10 p-6 space-y-3">
                    <h3 className="text-white font-medium mb-2">Customer</h3>
                    <p className="text-sm text-warm-gray"><span className="text-white">Name:</span> {order.customerName}</p>
                    <p className="text-sm text-warm-gray"><span className="text-white">Phone:</span> {order.customerPhone}</p>
                    {order.customerAddress && (
                        <p className="text-sm text-warm-gray"><span className="text-white">Address:</span> {order.customerAddress}</p>
                    )}
                    {order.notes && (
                        <p className="text-sm text-warm-gray"><span className="text-white">Notes:</span> {order.notes}</p>
                    )}
                </div>
                <div className="bg-gunmetal rounded-lg border border-warm-gray/10 p-6 space-y-3">
                    <h3 className="text-white font-medium mb-2">Summary</h3>
                    <p className="text-sm text-warm-gray"><span className="text-white">Subtotal:</span> Rs. {order.subtotal.toLocaleString()}</p>
                    <p className="text-sm text-warm-gray"><span className="text-white">Items:</span> {items.reduce((sum, i) => sum + i.quantity, 0)}</p>
                    <a
                        href={`https://wa.me/${order.customerPhone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-sm text-gold hover:text-gold-light transition-colors"
                    >
                        Message customer on WhatsApp →
                    </a>
                </div>
            </div>

            <div className="bg-gunmetal rounded-lg border border-warm-gray/10 overflow-hidden">
                <h3 className="text-white font-medium p-6 pb-4">Items</h3>
                <div className="divide-y divide-warm-gray/10">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                            <div className="relative w-14 h-14 shrink-0 bg-charcoal rounded overflow-hidden">
                                {item.productImage ? (
                                    <Image src={item.productImage} alt={item.productTitle} fill className="object-cover" />
                                ) : null}
                            </div>
                            <div className="flex-grow">
                                {item.productId ? (
                                    <Link href={`/admin/products/${item.productId}/edit`} className="text-white hover:text-gold transition-colors">
                                        {item.productTitle}
                                    </Link>
                                ) : (
                                    <span className="text-white">{item.productTitle}</span>
                                )}
                                <p className="text-xs text-warm-gray">Rs. {item.unitPrice.toLocaleString()} × {item.quantity}</p>
                            </div>
                            <p className="text-white font-medium">Rs. {item.lineTotal.toLocaleString()}</p>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between px-6 py-4 border-t border-warm-gray/10">
                    <span className="text-white font-medium">Subtotal</span>
                    <span className="text-gold font-medium">Rs. {order.subtotal.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}
