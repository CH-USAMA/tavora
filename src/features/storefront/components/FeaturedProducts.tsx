import { db } from "@/shared/lib/db";
import { products } from "@/shared/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";

export async function FeaturedProducts() {
    const featuredProducts = await db
        .select()
        .from(products)
        .where(eq(products.isVisible, true))
        .limit(6);

    if (featuredProducts.length === 0) {
        return (
            <section id="featured" className="py-24 bg-obsidian">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <span className="text-gold text-xs tracking-[0.3em] uppercase">Featured</span>
                    <h2 className="text-4xl md:text-5xl font-serif text-white mt-4 mb-6">Our Collection</h2>
                    <p className="text-warm-gray text-lg max-w-xl mx-auto">
                        Our curated collection of luxury watches is coming soon. Stay tuned.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section id="featured" className="py-24 bg-obsidian">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-gold text-xs tracking-[0.3em] uppercase">Featured</span>
                    <h2 className="text-4xl md:text-5xl font-serif text-white mt-4">Our Collection</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="group bg-charcoal border border-warm-gray/10 rounded-sm overflow-hidden transition-all duration-500 hover:border-gold/30 hover:shadow-[0_0_40px_rgba(212,175,55,0.08)] flex flex-col"
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
                            <div className="p-6 flex flex-col flex-grow">
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
                                    {product.externalUrl && (
                                        <a
                                            href={product.externalUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-gold border border-gold/40 px-3 py-1.5 hover:bg-gold hover:text-black transition-all tracking-wider uppercase"
                                        >
                                            Buy Now
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
