import { db } from "@/shared/lib/db";
import { products, categories } from "@/shared/lib/db/schema";
import { eq } from "drizzle-orm";
import { Navbar } from "@/features/storefront/components/Navbar";
import { Footer } from "@/features/storefront/components/Footer";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const p = await params;
    const [category] = await db.select().from(categories).where(eq(categories.slug, p.slug));
    if (!category) return { title: "Category Not Found" };
    return {
        title: `${category.name} | Tavora — Luxury Watches`,
        description: category.description || `Browse ${category.name} collection at Tavora.`,
    };
}

export default async function CategoryPage({ params }: Props) {
    const p = await params;
    const [category] = await db.select().from(categories).where(eq(categories.slug, p.slug));
    if (!category || !category.isVisible) notFound();

    const categoryProducts = await db.select().from(products).where(eq(products.categoryId, category.id));
    const visibleProducts = categoryProducts.filter(p => p.isVisible);

    return (
        <div className="min-h-screen flex flex-col bg-obsidian">
            <Navbar />
            <main className="flex-grow pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    <Link href="/shop" className="inline-flex items-center text-sm text-warm-gray hover:text-gold transition-colors mb-8 uppercase tracking-widest">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Shop
                    </Link>

                    <div className="mb-16">
                        <span className="text-gold text-xs tracking-[0.3em] uppercase block mb-4">Collection</span>
                        <h1 className="text-5xl md:text-6xl font-serif text-white mb-4">{category.name}</h1>
                        {category.description && (
                            <p className="text-warm-gray text-lg max-w-2xl font-light">{category.description}</p>
                        )}
                        <p className="text-warm-gray/50 text-sm mt-6 tracking-wider">
                            {visibleProducts.length} {visibleProducts.length === 1 ? 'Timepiece' : 'Timepieces'}
                        </p>
                    </div>

                    {visibleProducts.length === 0 ? (
                        <div className="text-center py-24">
                            <p className="text-warm-gray/50 text-lg font-serif">No timepieces in this collection yet</p>
                            <Link href="/shop" className="text-gold text-sm mt-4 inline-block hover:text-gold-light transition-colors uppercase tracking-widest">
                                Browse All
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {visibleProducts.map(product => (
                                <div key={product.id} className="group bg-charcoal border border-warm-gray/10 rounded-sm overflow-hidden transition-all duration-500 hover:border-gold/30 hover:shadow-[0_0_40px_rgba(212,175,55,0.08)] flex flex-col">
                                    <Link href={`/product/${product.slug}`} className="relative aspect-[4/5] bg-gunmetal block overflow-hidden">
                                        {product.imageUrl ? (
                                            <Image src={product.imageUrl} alt={product.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-warm-gray/30 text-sm tracking-widest uppercase">No Image</span>
                                            </div>
                                        )}
                                    </Link>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <p className="text-gold/60 text-[10px] tracking-[0.2em] uppercase mb-2">{product.brand || 'Tavora'}</p>
                                        <Link href={`/product/${product.slug}`}>
                                            <h3 className="text-lg font-serif text-white group-hover:text-gold transition-colors line-clamp-1">{product.title}</h3>
                                        </Link>
                                        <div className="flex items-baseline gap-2 mt-auto pt-4">
                                            <span className="text-gold font-medium">Rs. {product.price.toLocaleString()}</span>
                                            {product.salePrice != null && product.salePrice > 0 && (
                                                <span className="text-warm-gray/50 line-through text-sm">Rs. {product.salePrice.toLocaleString()}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
