"use client";

import { useCart } from "../CartContext";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

interface AddToCartProduct {
    id: string;
    slug: string;
    title: string;
    price: number;
    salePrice?: number | null;
    imageUrl?: string | null;
}

interface AddToCartButtonProps {
    product: AddToCartProduct;
    inStock?: boolean | null;
    quantity?: number;
    className?: string;
    label?: string;
}

export function AddToCartButton({ product, inStock = true, quantity = 1, className, label = "Add to Cart" }: AddToCartButtonProps) {
    const { addItem } = useCart();

    const effectivePrice =
        product.salePrice && product.salePrice > 0 && product.salePrice < product.price
            ? product.salePrice
            : product.price;

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(
            {
                productId: product.id,
                slug: product.slug,
                title: product.title,
                price: effectivePrice,
                image: product.imageUrl || null,
            },
            quantity
        );
        toast.success(`${product.title} added to cart`);
    };

    if (inStock === false) {
        return (
            <button
                disabled
                className={className || "flex items-center justify-center gap-2 w-full py-2.5 bg-charcoal border border-warm-gray/20 text-warm-gray/50 text-xs tracking-widest uppercase font-medium cursor-not-allowed"}
            >
                Out of Stock
            </button>
        );
    }

    return (
        <button
            onClick={handleAdd}
            className={className || "flex items-center justify-center gap-2 w-full py-2.5 bg-gold/10 border border-gold/30 text-gold hover:bg-gold hover:text-black transition-all duration-300 text-xs tracking-widest uppercase font-medium"}
        >
            <ShoppingBag className="w-3.5 h-3.5" />
            {label}
        </button>
    );
}
