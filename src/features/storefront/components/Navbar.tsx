import Link from "next/link";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-obsidian/80 backdrop-blur-md border-b border-warm-gray/10">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="text-2xl font-serif text-gold tracking-widest">
                    TAVORA
                </Link>
                <div className="hidden md:flex items-center space-x-8">
                    <Link href="/shop" className="text-sm text-warm-gray hover:text-gold transition-colors tracking-wider uppercase">
                        Shop
                    </Link>
                    <Link href="/shop?sort=newest" className="text-sm text-warm-gray hover:text-gold transition-colors tracking-wider uppercase">
                        New Arrivals
                    </Link>
                    <Link href="/#featured" className="text-sm text-warm-gray hover:text-gold transition-colors tracking-wider uppercase">
                        Featured
                    </Link>
                    <Link href="/#about" className="text-sm text-warm-gray hover:text-gold transition-colors tracking-wider uppercase">
                        About
                    </Link>
                </div>
                {/* Mobile menu button */}
                <button className="md:hidden text-warm-gray hover:text-gold transition-colors" aria-label="Menu">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </nav>
    );
}
