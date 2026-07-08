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
                                <span className="text-gold text-xs tracking-[0.3em] uppercase mb-4 block">
                                    {product.brand || "Tavora"}
                                </span>
                                <h1 className="text-4xl md:text-5xl font-serif text-white mb-4 leading-tight">
                                    {product.title}
                                </h1>
                                <div className="flex items-end gap-4">
                                    <span className="text-2xl text-gold font-light">
                                        Rs. {product.price.toLocaleString()}
                                    </span>
                                    {product.salePrice != null && product.salePrice > 0 && (
                                        <span className="text-lg text-warm-gray/50 line-through">
                                            Rs. {product.salePrice.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="prose prose-invert prose-p:text-warm-gray prose-p:font-light prose-p:leading-relaxed mb-12">
                                {product.description ? (
                                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
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
                                {/* WhatsApp Buy Button */}
                                <a
                                    href={`https://wa.me/923144293848?text=${encodeURIComponent(`Hi! I'm interested in buying: ${product.title} — Rs. ${(product.salePrice && product.salePrice > 0 ? product.salePrice : product.price).toLocaleString()}. Can you help me?`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 w-full py-4 text-center bg-[#25D366] hover:bg-[#20c55a] text-white transition-all uppercase tracking-[0.2em] text-sm font-medium shadow-[0_4px_20px_rgba(37,211,102,0.3)]"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                    Buy via WhatsApp
                                </a>
                                <p className="text-center text-warm-gray/40 text-xs pt-1">
                                    Chat directly with our team for the fastest response.
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
