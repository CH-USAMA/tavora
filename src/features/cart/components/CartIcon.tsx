"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../CartContext";

export function CartIcon() {
    const { itemCount } = useCart();

    return (
        <Link href="/cart" className="relative text-warm-gray hover:text-gold transition-colors" aria-label="View cart">
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center h-4 w-4 rounded-full bg-gold text-black text-[10px] font-bold">
                    {itemCount > 9 ? "9+" : itemCount}
                </span>
            )}
        </Link>
    );
}
