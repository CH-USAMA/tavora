"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "../CartContext";
import { toast } from "sonner";

interface ProductBuyBoxProps {
    product: {
        id: string;
        slug: string;
        title: string;
        price: number;
        salePrice: number | null;
        imageUrl: string | null;
    };
    inStock?: boolean | null;
}

export function ProductBuyBox({ product, inStock = true }: ProductBuyBoxProps) {
    const { addItem } = useCart();
    const [quantity, setQuantity] = useState(1);

    const handleAdd = () => {
        addItem(
            {
                productId: product.id,
                slug: product.slug,
                title: product.title,
                price: product.salePrice && product.salePrice > 0 && product.salePrice < product.price ? product.salePrice : product.price,
                image: product.imageUrl,
            },
            quantity
        );
        toast.success(`${product.title} (x${quantity}) added to cart`);
        setQuantity(1);
    };

    if (inStock === false) {
        return (
            <button disabled className="block w-full py-4 text-center bg-charcoal text-warm-gray/50 uppercase tracking-[0.2em] text-sm font-medium cursor-not-allowed border border-warm-gray/10">
                Out of Stock
            </button>
        );
    }

    return (
        <div className="flex items-stretch gap-3">
            <div className="flex items-center border border-warm-gray/20">
                <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 h-full text-warm-gray hover:text-gold transition-colors"
                    aria-label="Decrease quantity"
                >
                    <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-white text-sm min-w-[2ch] text-center">{quantity}</span>
                <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 h-full text-warm-gray hover:text-gold transition-colors"
                    aria-label="Increase quantity"
                >
                    <Plus className="w-3.5 h-3.5" />
                </button>
            </div>
            <button
                onClick={handleAdd}
                className="flex-1 flex items-center justify-center gap-3 py-4 text-center bg-gold text-black hover:bg-gold-light transition-all uppercase tracking-[0.2em] text-sm font-semibold"
            >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
            </button>
        </div>
    );
}
