import Link from "next/link";

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-obsidian">
            <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/95 to-obsidian" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                <div className="mb-8">
                    <div className="inline-block px-4 py-1.5 border border-gold/30 rounded-full mb-8">
                        <span className="text-gold text-xs tracking-[0.3em] uppercase">Curated Luxury</span>
                    </div>
                </div>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-tight tracking-tight">
                    Time,{" "}
                    <span className="text-gold italic">Redefined</span>
                </h1>
                <p className="text-lg md:text-xl text-warm-gray max-w-2xl mx-auto mb-12 leading-relaxed font-light">
                    Discover an exclusive collection of timepieces that embody elegance,
                    precision, and the art of fine watchmaking.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/shop" className="group px-10 py-4 bg-gold text-obsidian font-medium tracking-widest text-sm uppercase transition-all duration-300 hover:bg-gold-light hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                        Explore Collection
                    </Link>
                    <Link href="/#about" className="px-10 py-4 border border-warm-gray/30 text-warm-gray tracking-widest text-sm uppercase transition-all duration-300 hover:border-gold hover:text-gold">
                        Our Story
                    </Link>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-obsidian to-transparent" />
        </section>
    );
}
