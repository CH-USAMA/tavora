import Link from "next/link";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-obsidian/80 backdrop-blur-md border-b border-warm-gray/10">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="text-2xl font-serif text-gold tracking-widest">
                    TAVORA
                </Link>
                <div className="hidden md:flex items-center space-x-8">
                    <Link href="/#collections" className="text-sm text-warm-gray hover:text-gold transition-colors tracking-wider uppercase">
                        Collections
                    </Link>
                    <Link href="/#featured" className="text-sm text-warm-gray hover:text-gold transition-colors tracking-wider uppercase">
                        Featured
                    </Link>
                    <Link href="/#about" className="text-sm text-warm-gray hover:text-gold transition-colors tracking-wider uppercase">
                        About
                    </Link>
                </div>
            </div>
        </nav>
    );
}
