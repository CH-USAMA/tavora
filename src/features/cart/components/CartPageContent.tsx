"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../CartContext";

export function CartPageContent() {
    const { items, updateQuantity, removeItem, subtotal, isLoaded } = useCart();

    if (!isLoaded) {
        return null;
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-24">
                <ShoppingBag className="w-10 h-10 text-warm-gray/30 mx-auto mb-4" />
                <p className="text-warm-gray/50 text-lg font-serif">Your cart is empty</p>
                <Link href="/shop" className="text-gold text-sm mt-4 inline-block hover:text-gold-light transition-colors uppercase tracking-widest">
                    Browse Timepieces
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-4 bg-charcoal border border-warm-gray/10 p-4">
                        <Link href={`/product/${item.slug}`} className="relative w-20 h-20 shrink-0 bg-gunmetal overflow-hidden">
                            {item.image ? (
                                <Image src={item.image} alt={item.title} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-warm-gray/30 text-[9px] tracking-widest uppercase">No Image</span>
                                </div>
                            )}
                        </Link>
                        <div className="flex-grow min-w-0">
                            <Link href={`/product/${item.slug}`} className="text-white font-serif hover:text-gold transition-colors line-clamp-1">
                                {item.title}
                            </Link>
                            <p className="text-gold text-sm mt-1">Rs. {item.price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center border border-warm-gray/20 shrink-0">
                            <button
                                type="button"
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="px-2.5 py-2 text-warm-gray hover:text-gold transition-colors"
                                aria-label="Decrease quantity"
                            >
                                <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-white text-sm min-w-[2ch] text-center">{item.quantity}</span>
                            <button
                                type="button"
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="px-2.5 py-2 text-warm-gray hover:text-gold transition-colors"
                                aria-label="Increase quantity"
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>
                        <p className="text-white text-sm w-24 text-right shrink-0 hidden sm:block">
                            Rs. {(item.price * item.quantity).toLocaleString()}
                        </p>
                        <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            className="text-warm-gray hover:text-red-400 transition-colors shrink-0"
                            aria-label="Remove item"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="lg:col-span-1">
                <div className="sticky top-28 bg-charcoal border border-warm-gray/10 p-6 space-y-6">
                    <h3 className="text-white text-lg font-serif">Order Summary</h3>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-warm-gray">Subtotal</span>
                        <span className="text-white font-medium">Rs. {subtotal.toLocaleString()}</span>
                    </div>
                    <p className="text-warm-gray/50 text-xs">Shipping and final total will be confirmed via WhatsApp.</p>
                    <Link
                        href="/checkout"
                        className="block w-full py-4 text-center bg-gold text-black hover:bg-gold-light transition-all uppercase tracking-[0.2em] text-sm font-semibold"
                    >
                        Proceed to Checkout
                    </Link>
                    <Link href="/shop" className="block text-center text-warm-gray text-sm hover:text-gold transition-colors">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
