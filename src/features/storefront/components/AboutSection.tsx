export function AboutSection() {
    return (
        <section id="about" className="py-24 bg-charcoal">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-gold text-xs tracking-[0.3em] uppercase">Our Philosophy</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-white mt-4 mb-8 leading-tight">
                            Crafted for Those Who
                            <span className="text-gold italic"> Appreciate</span> Detail
                        </h2>
                        <p className="text-warm-gray leading-relaxed mb-6">
                            At Tavora, we believe a watch is more than a timepiece — it is a statement of
                            character, a commitment to craftsmanship, and a connection to timeless tradition.
                        </p>
                        <p className="text-warm-gray leading-relaxed">
                            Every piece in our collection is meticulously selected to meet the highest standards
                            of quality, design, and elegance. We don&apos;t follow trends — we set them.
                        </p>
                    </div>
                    <div className="relative">
                        <div className="aspect-[4/5] bg-gunmetal rounded-sm border border-warm-gray/10 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-6xl font-serif text-gold mb-4">T</div>
                                <p className="text-warm-gray/40 text-xs tracking-[0.3em] uppercase">Tavora</p>
                            </div>
                        </div>
                        {/* Decorative corner accent */}
                        <div className="absolute -top-3 -right-3 w-24 h-24 border-t border-r border-gold/30" />
                        <div className="absolute -bottom-3 -left-3 w-24 h-24 border-b border-l border-gold/30" />
                    </div>
                </div>
            </div>
        </section>
    );
}
