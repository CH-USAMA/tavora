import Link from "next/link";
import Image from "next/image";
import { HeroAnimations } from "./HeroAnimations";
import { SettingsService } from "@/features/settings/service";

export async function HeroSection() {
    const settings = await SettingsService.getSiteSettings();
    const message = encodeURIComponent(settings.whatsappMessage || "Hi! I'd like to know more about your luxury timepieces.");
    const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${message}`;

    return (
        <section className="relative min-h-[78vh] lg:min-h-[82vh] flex items-center justify-center overflow-hidden bg-obsidian">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop"
                    alt="Tavora Luxury Timepieces"
                    fill
                    priority
                    className="object-cover object-center opacity-35"
                />
            </div>
            
            {/* Animated gradient orbs */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] animate-[drift_8s_ease-in-out_infinite_alternate]" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold/4 rounded-full blur-[100px] animate-[drift_12s_ease-in-out_infinite_alternate-reverse]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/3 rounded-full blur-[150px] animate-[pulse_6s_ease-in-out_infinite]" />
            </div>

            {/* Animated grid overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.04]" style={{
                backgroundImage: 'linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)',
                backgroundSize: '80px 80px'
            }} />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/30 to-obsidian z-0" />

            {/* Horizontal sweep line animation */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent z-0 animate-[sweep_4s_ease-in-out_infinite]" />

            <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-24">
                {/* Eyebrow badge */}
                <div className="mb-6 flex justify-center">
                    <div className="inline-flex items-center gap-3 px-5 py-2 border border-gold/40 bg-obsidian/40 backdrop-blur-md rounded-full shadow-[0_0_25px_rgba(212,175,55,0.12)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                        <span className="text-gold text-xs font-medium tracking-[0.4em] uppercase">The New Standard of Luxury</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                    </div>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-5 leading-[1.0] tracking-tight drop-shadow-2xl">
                    Time,{" "}
                    <span className="relative inline-block">
                        <span className="text-gold italic">Redefined</span>
                        <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
                    </span>
                </h1>

                <p className="text-base md:text-lg text-warm-gray/90 max-w-2xl mx-auto mb-8 leading-relaxed font-light">
                    Discover an exclusive collection of timepieces that embody elegance, precision, and the masterful art of fine watchmaking.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/shop" className="group relative px-8 py-3.5 bg-gold text-black font-semibold tracking-[0.15em] text-sm uppercase transition-all duration-300 overflow-hidden shadow-[0_0_35px_rgba(212,175,55,0.35)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)]">
                        <span className="relative z-10 transition-colors duration-300 group-hover:text-black">Explore Collection</span>
                        <div className="absolute inset-0 h-full w-0 bg-white transition-all duration-500 ease-out group-hover:w-full z-0" />
                    </Link>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 px-8 py-3.5 border border-[#25D366]/50 text-[#25D366] tracking-[0.15em] text-sm uppercase transition-all duration-300 hover:bg-[#25D366]/10 hover:border-[#25D366] backdrop-blur-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        Chat with Seller
                    </a>
                    <Link href="/#about" className="px-8 py-3.5 border border-white/20 text-white/70 tracking-[0.15em] text-sm uppercase transition-all duration-300 hover:border-gold/40 hover:text-gold hover:bg-gold/5 backdrop-blur-sm">
                        Our Story
                    </Link>
                </div>

                {/* Trust badges */}
                <div className="mt-10 flex flex-wrap items-center justify-center gap-8 opacity-50">
                    {["100% Authentic", "Secure Checkout", "WhatsApp Support", "Premium Curated"].map((badge) => (
                        <span key={badge} className="text-warm-gray text-[10px] tracking-[0.25em] uppercase flex items-center gap-2">
                            <span className="w-1 h-1 bg-gold rounded-full" />
                            {badge}
                        </span>
                    ))}
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40 hover:opacity-80 transition-opacity cursor-pointer">
                <span className="text-[9px] text-warm-gray tracking-[0.4em] uppercase">Scroll</span>
                <div className="w-[1px] h-8 bg-gradient-to-b from-gold to-transparent animate-[pulse_2s_ease-in-out_infinite]" />
            </div>

            <HeroAnimations />
        </section>
    );
}
