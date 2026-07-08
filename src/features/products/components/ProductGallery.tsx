"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
    images: { url: string; alt: string | null }[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-[4/5] bg-charcoal rounded-sm overflow-hidden relative border border-warm-gray/10">
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-warm-gray/30 tracking-widest uppercase">No Image Available</span>
                </div>
            </div>
        );
    }

    const currentImage = images[currentIndex];

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-[4/5] bg-charcoal rounded-sm overflow-hidden relative border border-warm-gray/10 group">
                <Image
                    src={currentImage.url}
                    alt={currentImage.alt || `Product Image ${currentIndex + 1}`}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </div>

            {/* Thumbnails Slider */}
            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`relative w-24 h-24 shrink-0 rounded-sm overflow-hidden border-2 transition-all ${
                                idx === currentIndex ? "border-gold" : "border-warm-gray/20 hover:border-gold/50"
                            }`}
                        >
                            <Image
                                src={img.url}
                                alt={img.alt || `Thumbnail ${idx + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
