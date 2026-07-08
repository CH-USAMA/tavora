"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
};

interface ProductSliderProps {
    products: Product[];
}

const WHATSAPP = "923144293848";

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
                    const waMessage = encodeURIComponent(`Hi! I'm interested in buying: ${product.title} (Rs. ${(product.salePrice && product.salePrice > 0 ? product.salePrice : product.price).toLocaleString()}). Can you help me?`);
                    const waUrl = `https://wa.me/${WHATSAPP}?text=${waMessage}`;

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
                                        Rs. {(product.salePrice && product.salePrice > 0 ? product.salePrice : product.price).toLocaleString()}
                                    </span>
                                    {product.salePrice != null && product.salePrice > 0 && (
                                        <span className="text-warm-gray/40 line-through text-sm">
                                            Rs. {product.price.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                                {/* WhatsApp Buy Button */}
                                <a
                                    href={waUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-300 text-xs tracking-widest uppercase font-medium"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                    Buy via WhatsApp
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
