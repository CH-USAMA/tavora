import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-obsidian">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop"
                    alt="Tavora Luxury Timepieces"
                    fill
                    priority
                    className="object-cover object-center opacity-40 scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]"
                />
            </div>
            
            {/* Elegant Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-obsidian/80 via-obsidian/40 to-obsidian z-0" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-obsidian/20 to-obsidian/80 z-0" />

            <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20">
                <div className="mb-8 transform transition-all duration-1000 translate-y-0 opacity-100">
                    <div className="inline-block px-5 py-2 border border-gold/40 bg-obsidian/30 backdrop-blur-md rounded-full mb-8 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                        <span className="text-gold text-xs font-medium tracking-[0.4em] uppercase">The New Standard of Luxury</span>
                    </div>
                </div>
                
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white mb-6 leading-[1.1] tracking-tight drop-shadow-2xl">
                    Time,{" "}
                    <span className="text-gold italic relative inline-block">
                        Redefined
                        <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-50"></span>
                    </span>
                </h1>
                
                <p className="text-lg md:text-2xl text-warm-gray/90 max-w-3xl mx-auto mb-14 leading-relaxed font-light drop-shadow-md">
                    Discover an exclusive collection of timepieces that embody elegance, precision, and the masterful art of fine watchmaking.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link href="/shop" className="group relative px-12 py-5 bg-gold text-black font-semibold tracking-[0.2em] text-sm uppercase transition-all duration-300 hover:bg-white overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.3)]">
                        <span className="relative z-10">Explore Collection</span>
                        <div className="absolute inset-0 h-full w-0 bg-white transition-all duration-500 ease-out group-hover:w-full z-0"></div>
                    </Link>
                    <Link href="/#about" className="px-12 py-5 border border-white/30 text-white tracking-[0.2em] text-sm uppercase transition-all duration-300 hover:border-gold hover:text-gold hover:bg-gold/5 backdrop-blur-sm">
                        Our Story
                    </Link>
                </div>
            </div>
            
            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity cursor-pointer animate-bounce">
                <span className="text-[10px] text-warm-gray tracking-[0.3em] uppercase mb-2">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-gold to-transparent" />
            </div>
        </section>
    );
}
