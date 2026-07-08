import Image from "next/image";

export function AboutSection() {
    return (
        <section id="about" className="py-24 bg-charcoal relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
            
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Founder Image Side */}
                    <div className="relative order-2 lg:order-1">
                        <div className="relative aspect-[3/4] w-full max-w-md mx-auto lg:mx-0 rounded-sm overflow-hidden border border-warm-gray/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                            {/* USER: Replace this src with Taha Munawar's image URL */}
                            <Image 
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop" 
                                alt="Taha Munawar - Founder of Tavora" 
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                            
                            {/* Decorative Frame */}
                            <div className="absolute inset-0 border-[8px] border-obsidian/50 m-4 z-10 pointer-events-none" />
                        </div>
                        
                        {/* Abstract Decorative Elements */}
                        <div className="absolute -top-6 -left-6 w-32 h-32 border-t-2 border-l-2 border-gold/40 z-0 hidden md:block" />
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-2 border-r-2 border-gold/40 z-0 hidden md:block" />
                        
                        {/* Floating Badge */}
                        <div className="absolute bottom-10 -right-6 lg:-right-12 bg-obsidian border border-gold/30 p-4 shadow-2xl z-20">
                            <p className="text-gold font-serif text-2xl mb-1">2026</p>
                            <p className="text-white text-xs tracking-widest uppercase">Established</p>
                        </div>
                    </div>

                    {/* Story Content Side */}
                    <div className="order-1 lg:order-2">
                        <div className="inline-flex items-center gap-4 mb-6">
                            <span className="w-12 h-px bg-gold/50 block" />
                            <span className="text-gold text-xs tracking-[0.3em] uppercase font-medium">Our Story</span>
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-8 leading-[1.1]">
                            Passion <span className="text-gold italic">Knows No Age</span>
                        </h2>
                        
                        <div className="prose prose-invert prose-p:text-warm-gray/90 prose-p:font-light prose-p:leading-relaxed max-w-none">
                            <p className="text-xl text-white font-medium mb-6">
                                Age is but a number, but time is everything.
                            </p>
                            <p>
                                At just 13 years old, Taha Munawar founded Tavora out of a profound fascination with horology. What started as a young boy&apos;s curiosity with the intricate gears, precise movements, and timeless elegance of classic watches quickly blossomed into a vision for a curated destination for luxury timepieces.
                            </p>
                            <p>
                                Tavora is a testament to the belief that true craftsmanship speaks for itself. Every piece in our collection is meticulously selected to meet the highest standards of quality, design, and heritage. We don&apos;t just sell watches; we curate heirlooms.
                            </p>
                            <p className="mt-8 italic text-gold/80 font-serif text-lg">
                                &quot;A watch is more than a tool to tell time—it is a statement of character and a connection to timeless tradition.&quot;
                            </p>
                            
                            <div className="mt-10 pt-8 border-t border-warm-gray/10 flex items-center gap-6">
                                <div>
                                    <p className="text-white font-serif text-xl">Taha Munawar</p>
                                    <p className="text-gold text-xs tracking-widest uppercase mt-1">Founder & Curator</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
