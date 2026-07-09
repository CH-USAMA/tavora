import { db } from "@/shared/lib/db";
import { orders } from "@/shared/lib/db/schema";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { OrderStatusSelect } from "@/features/orders/components/OrderStatusSelect";
import { OrderStatus } from "@/features/orders/types";
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

export default async function AdminOrdersPage() {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white font-serif">Orders</h2>
                <p className="text-sm text-warm-gray mt-1">Orders placed via WhatsApp checkout.</p>
            </div>

            <div className="bg-gunmetal rounded-md border border-warm-gray/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-warm-gray/10 hover:bg-transparent">
                                <TableHead className="text-warm-gray">Order #</TableHead>
                                <TableHead className="text-warm-gray">Customer</TableHead>
                                <TableHead className="text-warm-gray">Phone</TableHead>
                                <TableHead className="text-warm-gray text-right">Subtotal</TableHead>
                                <TableHead className="text-warm-gray text-right">Status</TableHead>
                                <TableHead className="text-warm-gray text-right">Date</TableHead>
                                <TableHead className="text-warm-gray text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allOrders.length === 0 ? (
                                <TableRow className="border-warm-gray/10 hover:bg-white/5">
                                    <TableCell colSpan={7} className="h-24 text-center text-warm-gray">
                                        No orders yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                allOrders.map((order) => (
                                    <TableRow key={order.id} className="border-warm-gray/10 hover:bg-white/5">
                                        <TableCell className="font-mono text-sm text-white">{order.orderNumber}</TableCell>
                                        <TableCell className="text-white">{order.customerName}</TableCell>
                                        <TableCell className="text-warm-gray">{order.customerPhone}</TableCell>
                                        <TableCell className="text-warm-gray text-right">Rs. {order.subtotal.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">
                                            <OrderStatusSelect orderId={order.id} status={order.status as OrderStatus} />
                                        </TableCell>
                                        <TableCell className="text-warm-gray/60 text-right text-sm">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild variant="ghost" size="sm" className="text-warm-gray hover:text-gold hover:bg-transparent">
                                                <Link href={`/admin/orders/${order.id}`}>View</Link>
                                            </Button>
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
