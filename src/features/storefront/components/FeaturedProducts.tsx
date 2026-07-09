import { db } from "@/shared/lib/db";
import { products } from "@/shared/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { ProductSlider } from "./ProductSlider";
import { SettingsService } from "@/features/settings/service";

export async function FeaturedProducts() {
    // Fetch latest products instead of just any featured, to showcase new arrivals
    const [featuredProducts, settings] = await Promise.all([
        db
            .select()
            .from(products)
            .where(eq(products.isVisible, true))
            .orderBy(desc(products.createdAt))
            .limit(8),
        SettingsService.getSiteSettings(),
    ]);

    if (featuredProducts.length === 0) {
        return (
            <section id="featured" className="py-24 bg-obsidian relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <span className="text-gold text-xs tracking-[0.3em] uppercase">New Arrivals</span>
                    <h2 className="text-4xl md:text-5xl font-serif text-white mt-4 mb-6">Latest Additions</h2>
                    <p className="text-warm-gray text-lg max-w-xl mx-auto">
                        Our curated collection of luxury watches is coming soon. Stay tuned.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section id="featured" className="py-24 bg-obsidian relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
            
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <span className="text-gold text-xs tracking-[0.3em] uppercase font-medium">New Arrivals</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-white mt-4">Latest Additions</h2>
                    </div>
                    <Link href="/shop" className="text-warm-gray hover:text-gold transition-colors text-sm uppercase tracking-widest border-b border-warm-gray/30 hover:border-gold pb-1 self-start md:self-auto">
                        View All Pieces
                    </Link>
                </div>
                
                <ProductSlider products={featuredProducts} whatsappNumber={settings.whatsappNumber} />
            </div>
        </section>
    );
}
