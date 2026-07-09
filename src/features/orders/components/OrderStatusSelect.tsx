"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateOrderStatusAction } from "../actions";
import { orderStatuses, OrderStatus } from "../types";

const statusStyles: Record<OrderStatus, string> = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
};

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: OrderStatus }) {
    const [current, setCurrent] = useState(status);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const next = e.target.value as OrderStatus;
        const prev = current;
        setCurrent(next);
        setIsUpdating(true);
        try {
            const res = await updateOrderStatusAction(orderId, next);
            if (res.success) {
                toast.success(`Order marked as ${next}`);
            } else {
                setCurrent(prev);
                toast.error(res.error || "Failed to update status");
            }
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <select
            value={current}
            onChange={handleChange}
            disabled={isUpdating}
            className={`text-xs font-medium rounded-full px-2.5 py-1 border-0 capitalize cursor-pointer disabled:opacity-50 ${statusStyles[current]}`}
        >
            {orderStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
            ))}
        </select>
    );
}
