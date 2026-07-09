import { z } from "zod";

export const orderStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;
export type OrderStatus = (typeof orderStatuses)[number];

export const orderItemInputSchema = z.object({
    productId: z.string(),
    title: z.string(),
    image: z.string().nullable().optional(),
    price: z.number(),
    quantity: z.number().min(1),
});

export const createOrderSchema = z.object({
    customerName: z.string().min(1, "Name is required"),
    customerPhone: z.string().min(6, "Phone number is required"),
    customerAddress: z.string().optional(),
    notes: z.string().optional(),
    items: z.array(orderItemInputSchema).min(1, "Cart is empty"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
