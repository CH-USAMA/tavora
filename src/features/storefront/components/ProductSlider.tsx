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
};

interface ProductSliderProps {
    products: Product[];
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
                className="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-1/2 z-10 bg-obsidian border border-warm-gray/20 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-gold hover:text-black hover:border-gold disabled:opacity-0 hidden md:block"
                aria-label="Scroll left"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-1/2 z-10 bg-obsidian border border-warm-gray/20 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-gold hover:text-black hover:border-gold hidden md:block"
                aria-label="Scroll right"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Slider Container */}
            <div 
                ref={sliderRef}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="snap-start shrink-0 w-[85vw] sm:w-[350px] md:w-[400px] group bg-charcoal border border-warm-gray/10 rounded-sm overflow-hidden transition-all duration-500 hover:border-gold/30 hover:shadow-[0_0_40px_rgba(212,175,55,0.08)] flex flex-col"
                    >
                        <Link href={`/product/${product.slug}`} className="relative aspect-[4/5] bg-gunmetal block overflow-hidden">
                            {product.imageUrl ? (
                                <Image
                                    src={product.imageUrl}
                                    alt={product.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-warm-gray/30 text-sm tracking-widest uppercase">No Image</span>
                                </div>
                            )}
                        </Link>
                        <div className="p-6 flex flex-col flex-grow bg-charcoal">
                            <p className="text-gold/60 text-[10px] tracking-[0.2em] uppercase mb-2">{product.brand || 'Tavora'}</p>
                            <Link href={`/product/${product.slug}`}>
                                <h3 className="text-lg font-serif text-white group-hover:text-gold transition-colors line-clamp-1">
                                    {product.title}
                                </h3>
                            </Link>
                            <div className="flex items-center justify-between mt-auto pt-4">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-gold font-medium">Rs. {product.price.toLocaleString()}</span>
                                    {product.salePrice && (
                                        <span className="text-warm-gray/50 line-through text-sm">
                                            Rs. {product.salePrice.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Custom scrollbar hide styles */}
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}
