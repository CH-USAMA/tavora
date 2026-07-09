"use server";

import { db } from "@/shared/lib/db";
import { orders, orderItems } from "@/shared/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createOrderSchema, CreateOrderInput, orderStatuses, OrderStatus } from "./types";
import { requireAdmin } from "@/shared/lib/auth/require-admin";

// Public action — called from the storefront checkout page, intentionally no auth check.
export async function createOrderAction(data: CreateOrderInput) {
    try {
        const validated = createOrderSchema.parse(data);
        const subtotal = validated.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const orderId = randomUUID();
        const orderNumber = `TAV-${Date.now().toString().slice(-8)}`;

        await db.insert(orders).values({
            id: orderId,
            orderNumber,
            customerName: validated.customerName,
            customerPhone: validated.customerPhone,
            customerAddress: validated.customerAddress || null,
            notes: validated.notes || null,
            subtotal,
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await db.insert(orderItems).values(
            validated.items.map((item) => ({
                id: randomUUID(),
                orderId,
                productId: item.productId,
                productTitle: item.title,
                productImage: item.image || null,
                unitPrice: item.price,
                quantity: item.quantity,
                lineTotal: item.price * item.quantity,
            }))
        );

        revalidatePath("/admin/orders");
        revalidatePath("/admin");
        return { success: true, orderId, orderNumber, subtotal };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateOrderStatusAction(id: string, status: OrderStatus) {
    try {
        await requireAdmin();
        if (!orderStatuses.includes(status)) {
            throw new Error("Invalid order status");
        }

        await db.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.id, id));

        revalidatePath("/admin/orders");
        revalidatePath("/admin");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
