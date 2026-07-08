import { db } from "@/shared/lib/db";
import { products, categories } from "@/shared/lib/db/schema";
import { eq } from "drizzle-orm";
import { Navbar } from "@/features/storefront/components/Navbar";
import { Footer } from "@/features/storefront/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Shop | Tavora — Luxury Watches",
    description: "Browse our curated collection of luxury timepieces.",
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string; sort?: string }> }) {
    const sp = await searchParams;
    const allCategories = await db.select().from(categories).where(eq(categories.isVisible, true));

    let allProducts = await db.select().from(products).where(eq(products.isVisible, true));

    // Filter by category
    if (sp.category) {
        const cat = allCategories.find(c => c.slug === sp.category);
        if (cat) {
            allProducts = allProducts.filter(p => p.categoryId === cat.id);
        }
    }

    // Sort
    if (sp.sort === 'price-asc') {
        allProducts.sort((a, b) => a.price - b.price);
    } else if (sp.sort === 'price-desc') {
        allProducts.sort((a, b) => b.price - a.price);
    } else {
        allProducts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    const activeCategory = sp.category || null;
    const activeSort = sp.sort || 'newest';

    function buildSortUrl(sort: string) {
        const params = new URLSearchParams();
        if (activeCategory) params.set('category', activeCategory);
        params.set('sort', sort);
        return `/shop?${params.toString()}`;
    }

    return (
        <div className="min-h-screen flex flex-col bg-obsidian">
            <Navbar />
            <main className="flex-grow pt-28 pb-24">
                {/* Page Header */}
                <div className="max-w-7xl mx-auto px-6 mb-16">
                    <div className="text-center">
                        <span className="text-gold text-xs tracking-[0.3em] uppercase">Tavora</span>
                        <h1 className="text-5xl md:text-6xl font-serif text-white mt-4 mb-4">Our Collection</h1>
                        <p className="text-warm-gray text-lg max-w-xl mx-auto font-light">
                            Discover timepieces crafted for those who appreciate the extraordinary.
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Sidebar Filters */}
                        <aside className="lg:w-64 shrink-0">
                            <div className="sticky top-28">
                                <h3 className="text-white text-xs tracking-[0.2em] uppercase mb-6 pb-3 border-b border-warm-gray/10">Categories</h3>
                                <ul className="space-y-3">
                                    <li>
                                        <Link
                                            href="/shop"
                                            className={`text-sm transition-colors ${!activeCategory ? 'text-gold' : 'text-warm-gray hover:text-gold'}`}
                                        >
                                            All Timepieces
                                        </Link>
                                    </li>
                                    {allCategories.map(cat => (
                                        <li key={cat.id}>
                                            <Link
                                                href={`/shop?category=${cat.slug}`}
                                                className={`text-sm transition-colors ${activeCategory === cat.slug ? 'text-gold' : 'text-warm-gray hover:text-gold'}`}
                                            >
                                                {cat.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>

                                <h3 className="text-white text-xs tracking-[0.2em] uppercase mb-6 pb-3 border-b border-warm-gray/10 mt-12">Sort By</h3>
                                <ul className="space-y-3">
                                    <li>
                                        <Link href={buildSortUrl('newest')} className={`text-sm transition-colors ${activeSort === 'newest' ? 'text-gold' : 'text-warm-gray hover:text-gold'}`}>
                                            Newest
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={buildSortUrl('price-asc')} className={`text-sm transition-colors ${activeSort === 'price-asc' ? 'text-gold' : 'text-warm-gray hover:text-gold'}`}>
                                            Price: Low to High
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={buildSortUrl('price-desc')} className={`text-sm transition-colors ${activeSort === 'price-desc' ? 'text-gold' : 'text-warm-gray hover:text-gold'}`}>
                                            Price: High to Low
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </aside>

                        {/* Product Grid */}
                        <div className="flex-grow">
                            <div className="flex items-center justify-between mb-8">
                                <p className="text-warm-gray/60 text-sm tracking-wider">
                                    {allProducts.length} {allProducts.length === 1 ? 'Timepiece' : 'Timepieces'}
                                </p>
                            </div>

                            {allProducts.length === 0 ? (
                                <div className="text-center py-24">
                                    <p className="text-warm-gray/50 text-lg font-serif">No timepieces found</p>
                                    <p className="text-warm-gray/30 text-sm mt-2">Check back soon for new arrivals.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {allProducts.map(product => (
                                        <div key={product.id} className="group bg-charcoal border border-warm-gray/10 rounded-sm overflow-hidden transition-all duration-500 hover:border-gold/30 hover:shadow-[0_0_40px_rgba(212,175,55,0.08)] flex flex-col">
                                            <Link href={`/product/${product.slug}`} className="relative aspect-[4/5] bg-gunmetal block overflow-hidden">
                                                {product.imageUrl ? (
                                                    <Image src={product.imageUrl} alt={product.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span className="text-warm-gray/30 text-sm tracking-widest uppercase">No Image</span>
                                                    </div>
                                                )}
                                                {product.isNewArrival && (
                                                    <span className="absolute top-4 left-4 bg-gold text-black text-[10px] tracking-widest uppercase px-3 py-1">New</span>
                                                )}
                                                {product.salePrice && (
                                                    <span className="absolute top-4 right-4 bg-red-600 text-white text-[10px] tracking-widest uppercase px-3 py-1">Sale</span>
                                                )}
                                            </Link>
                                            <div className="p-6 flex flex-col flex-grow">
                                                <p className="text-gold/60 text-[10px] tracking-[0.2em] uppercase mb-2">{product.brand || 'Tavora'}</p>
                                                <Link href={`/product/${product.slug}`}>
                                                    <h3 className="text-lg font-serif text-white group-hover:text-gold transition-colors line-clamp-1">{product.title}</h3>
                                                </Link>
                                                <div className="flex items-baseline gap-2 mt-auto pt-4">
                                                    <span className="text-gold font-medium">Rs. {product.price.toLocaleString()}</span>
                                                    {product.salePrice && (
                                                        <span className="text-warm-gray/50 line-through text-sm">Rs. {product.salePrice.toLocaleString()}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
