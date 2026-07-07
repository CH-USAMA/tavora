import { db } from "@/shared/lib/db";
import { products } from "@/shared/lib/db/schema";
import { eq } from "drizzle-orm";
import { Navbar } from "@/features/storefront/components/Navbar";
import { Footer } from "@/features/storefront/components/Footer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

interface Props {
    params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const [product] = await db.select().from(products).where(eq(products.slug, params.slug));
    if (!product) return { title: "Product Not Found" };

    return {
        title: `${product.seoTitle || product.title} | Tavora`,
        description: product.seoDescription || product.description?.substring(0, 160),
    };
}

export default async function ProductDetailPage({ params }: Props) {
    const [product] = await db
        .select()
        .from(products)
        .where(eq(products.slug, params.slug));

    if (!product || !product.isVisible) {
        notFound();
    }

    return (
        <div className="min-h-screen flex flex-col bg-obsidian">
            <Navbar />
            
            <main className="flex-grow pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    <Link href="/" className="inline-flex items-center text-sm text-warm-gray hover:text-gold transition-colors mb-8 uppercase tracking-widest">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Collection
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="aspect-[4/5] bg-charcoal rounded-sm overflow-hidden relative border border-warm-gray/10">
                                {product.imageUrl ? (
                                    <img 
                                        src={product.imageUrl} 
                                        alt={product.title} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-warm-gray/30 tracking-widest uppercase">No Image Available</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Product Info */}
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
                                    {product.salePrice && (
                                        <span className="text-lg text-warm-gray/50 line-through">
                                            Rs. {product.salePrice.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="prose prose-invert prose-p:text-warm-gray prose-p:font-light prose-p:leading-relaxed mb-12">
                                <p>{product.description || "An exquisite piece crafted with precision and elegance."}</p>
                            </div>

                            <div className="mt-auto pt-8 border-t border-warm-gray/10">
                                {product.externalUrl ? (
                                    <a
                                        href={product.externalUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full py-5 text-center bg-gold text-black hover:bg-gold-light transition-all uppercase tracking-[0.2em] text-sm font-medium"
                                    >
                                        Purchase via Official Retailer
                                    </a>
                                ) : (
                                    <button disabled className="block w-full py-5 text-center bg-charcoal text-warm-gray/50 uppercase tracking-[0.2em] text-sm font-medium cursor-not-allowed border border-warm-gray/10">
                                        Currently Unavailable
                                    </button>
                                )}
                                <p className="text-center text-warm-gray/50 text-xs mt-4">
                                    You will be securely redirected to our verified dropshipping partner.
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
