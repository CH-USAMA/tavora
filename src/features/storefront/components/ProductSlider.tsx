"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";

type Product = {
    id: string;
    slug: string;
    title: string;
    price: number;
    salePrice: number | null;
    imageUrl: string | null;
    brand: string | null;
    isBestSeller?: boolean | null;
    isNewArrival?: boolean | null;
    externalUrl?: string | null;
    inStock?: boolean | null;
};

interface ProductSliderProps {
    products: Product[];
}

function getDiscountPercent(price: number, salePrice: number | null) {
    if (!salePrice || salePrice <= 0 || salePrice >= price) return null;
    return Math.round(((price - salePrice) / price) * 100);
}

export function ProductSlider({ products }: ProductSliderProps) {
    const sliderRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (sliderRef.current) {
            const { scrollLeft, clientWidth } = sliderRef.current;
            const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            sliderRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-warm-gray text-lg">No products available at the moment.</p>
            </div>
        );
    }

    return (
        <div className="relative group">
            {/* Navigation Buttons */}
            <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-5 z-10 bg-obsidian border border-warm-gray/20 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-gold hover:text-black hover:border-gold hidden md:flex items-center justify-center"
                aria-label="Scroll left"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-5 z-10 bg-obsidian border border-warm-gray/20 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-gold hover:text-black hover:border-gold hidden md:flex items-center justify-center"
                aria-label="Scroll right"
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            {/* Slider Container */}
            <div
                ref={sliderRef}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {products.map((product) => {
                    const discount = getDiscountPercent(product.price, product.salePrice);

                    return (
                        <div
                            key={product.id}
                            className="snap-start shrink-0 w-[85vw] sm:w-[320px] md:w-[360px] group/card bg-charcoal border border-warm-gray/10 rounded-sm overflow-hidden transition-all duration-500 hover:border-gold/30 hover:shadow-[0_0_40px_rgba(212,175,55,0.08)] flex flex-col"
                        >
                            <Link href={`/product/${product.slug}`} className="relative aspect-[4/5] bg-gunmetal block overflow-hidden">
                                {product.imageUrl ? (
                                    <Image
                                        src={product.imageUrl}
                                        alt={product.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-warm-gray/30 text-sm tracking-widest uppercase">No Image</span>
                                    </div>
                                )}
                                {/* Badges */}
                                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                                    {product.isBestSeller && (
                                        <span className="bg-amber-500 text-black text-[9px] font-bold tracking-[0.15em] uppercase px-2.5 py-1">
                                            🏆 Best Seller
                                        </span>
                                    )}
                                    {product.isNewArrival && (
                                        <span className="bg-emerald-500 text-white text-[9px] font-bold tracking-[0.15em] uppercase px-2.5 py-1">
                                            ✨ New
                                        </span>
                                    )}
                                </div>
                                {discount && (
                                    <span className="absolute top-3 right-3 bg-red-600 text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1">
                                        -{discount}% OFF
                                    </span>
                                )}
                            </Link>
                            <div className="p-5 flex flex-col flex-grow bg-charcoal">
                                <p className="text-gold/60 text-[9px] tracking-[0.2em] uppercase mb-1.5">{product.brand || 'Tavora'}</p>
                                <Link href={`/product/${product.slug}`}>
                                    <h3 className="text-base font-serif text-white group-hover/card:text-gold transition-colors line-clamp-1 mb-3">
                                        {product.title}
                                    </h3>
                                </Link>
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-gold font-semibold text-lg">
                                        Rs. {(product.salePrice && product.salePrice > 0 && product.salePrice < product.price ? product.salePrice : product.price).toLocaleString()}
                                    </span>
                                    {product.salePrice != null && product.salePrice > 0 && product.salePrice < product.price && (
                                        <span className="text-warm-gray/40 line-through text-sm">
                                            Rs. {product.price.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                                <AddToCartButton
                                    product={product}
                                    inStock={product.inStock}
                                    className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-gold/10 border border-gold/30 text-gold hover:bg-gold hover:text-black transition-all duration-300 text-xs tracking-widest uppercase font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
