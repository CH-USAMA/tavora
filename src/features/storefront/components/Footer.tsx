import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-obsidian border-t border-warm-gray/10 py-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    <div>
                        <h3 className="font-serif text-2xl text-gold tracking-widest mb-4">TAVORA</h3>
                        <p className="text-warm-gray text-sm leading-relaxed">
                            A new standard of luxury. Curated timepieces for the discerning collector.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white text-sm tracking-widest uppercase mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link href="/#featured" className="text-warm-gray text-sm hover:text-gold transition-colors">Collection</Link></li>
                            <li><Link href="/#about" className="text-warm-gray text-sm hover:text-gold transition-colors">About</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white text-sm tracking-widest uppercase mb-4">Contact</h4>
                        <p className="text-warm-gray text-sm">info@tavora.com</p>
                    </div>
                </div>
                <div className="border-t border-warm-gray/10 pt-8 text-center">
                    <p className="text-warm-gray/50 text-xs tracking-wider">
                        &copy; {new Date().getFullYear()} Tavora. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
