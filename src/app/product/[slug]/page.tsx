import { db } from "@/shared/lib/db";
import { products, productImages } from "@/shared/lib/db/schema";
import { eq } from "drizzle-orm";
import { Navbar } from "@/features/storefront/components/Navbar";
import { Footer } from "@/features/storefront/components/Footer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import { ProductGallery } from "@/features/products/components/ProductGallery";
import { ProductBuyBox } from "@/features/cart/components/ProductBuyBox";
import sanitizeHtml from "sanitize-html";

const sanitizeOptions: sanitizeHtml.IOptions = {
    allowedTags: [
        "p", "br", "strong", "b", "em", "i", "u", "s", "strike",
        "ol", "ul", "li", "a", "span", "blockquote",
        "h1", "h2", "h3", "h4", "h5", "h6", "sub", "sup",
    ],
    allowedAttributes: {
        a: ["href", "target", "rel"],
        span: ["style"],
    },
    allowedStyles: {
        "*": {
            color: [/^#[0-9a-fA-F]{3,6}$/, /^rgb\(/],
            "background-color": [/^#[0-9a-fA-F]{3,6}$/, /^rgb\(/],
        },
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
};

export const dynamic = "force-dynamic";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const p = await params;
    const [product] = await db.select().from(products).where(eq(products.slug, p.slug));
    if (!product) return { title: "Product Not Found" };
    return {
        title: `${product.seoTitle || product.title} | Tavora`,
        description: product.seoDescription || product.description?.substring(0, 160),
    };
}

export default async function ProductDetailPage({ params }: Props) {
    const p = await params;
    const [product] = await db.select().from(products).where(eq(products.slug, p.slug));

    if (!product || !product.isVisible) {
        notFound();
    }

    const allImages = await db.select().from(productImages).where(eq(productImages.productId, product.id));
    allImages.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    // Fallback for older products that only have imageUrl
    const galleryImages = allImages.length > 0 
        ? allImages.map(img => ({ url: img.url, alt: img.alt }))
        : product.imageUrl ? [{ url: product.imageUrl, alt: product.title }] : [];

    return (
        <div className="min-h-screen flex flex-col bg-obsidian">
            <Navbar />
            <main className="flex-grow pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    <Link href="/shop" className="inline-flex items-center text-sm text-warm-gray hover:text-gold transition-colors mb-8 uppercase tracking-widest">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Shop
                    </Link>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <ProductGallery images={galleryImages} />
                        <div className="flex flex-col">
                            <div className="mb-8 border-b border-warm-gray/10 pb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-gold text-xs tracking-[0.3em] uppercase block">
                                        {product.brand || "Tavora"}
                                    </span>
                                    {product.inStock === false && (
                                        <span className="bg-red-600/20 text-red-400 border border-red-600/30 text-[10px] tracking-widest uppercase px-2 py-0.5">Out of Stock</span>
                                    )}
                                </div>
                                <h1 className="text-4xl md:text-5xl font-serif text-white mb-4 leading-tight">
                                    {product.title}
                                </h1>
                                <div className="flex items-end gap-4">
                                    <span className="text-2xl text-gold font-light">
                                        Rs. {(product.salePrice && product.salePrice > 0 && product.salePrice < product.price ? product.salePrice : product.price).toLocaleString()}
                                    </span>
                                    {product.salePrice != null && product.salePrice > 0 && product.salePrice < product.price && (
                                        <span className="text-lg text-warm-gray/50 line-through">
                                            Rs. {product.price.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="prose prose-invert prose-p:text-warm-gray prose-p:font-light prose-p:leading-relaxed mb-12">
                                {product.description ? (
                                    <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description, sanitizeOptions) }} />
                                ) : (
                                    <p>An exquisite piece crafted with precision and elegance.</p>
                                )}
                            </div>
                            <div className="mt-auto pt-8 border-t border-warm-gray/10 space-y-3">
                                {product.externalUrl ? (
                                    <a href={product.externalUrl} target="_blank" rel="noopener noreferrer"
                                        className="block w-full py-5 text-center bg-gold text-black hover:bg-white transition-all uppercase tracking-[0.2em] text-sm font-semibold">
                                        Purchase via Official Retailer
                                    </a>
                                ) : (
                                    <button disabled className="block w-full py-5 text-center bg-charcoal text-warm-gray/50 uppercase tracking-[0.2em] text-sm font-medium cursor-not-allowed border border-warm-gray/10">
                                        Currently Unavailable
                                    </button>
                                )}
                                <ProductBuyBox product={product} inStock={product.inStock} />
                                <p className="text-center text-warm-gray/40 text-xs pt-1">
                                    Add to cart, then checkout via WhatsApp for the fastest response.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
