"use client";

import Link from "next/link";
import { useState } from "react";
import { X } from "lucide-react";
import { CartIcon } from "@/features/cart/components/CartIcon";

const links = [
    { href: "/shop", label: "Shop" },
    { href: "/shop?sort=newest", label: "New Arrivals" },
    { href: "/#featured", label: "Featured" },
    { href: "/#about", label: "About" },
];

export function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-obsidian/80 backdrop-blur-md border-b border-warm-gray/10">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="text-2xl font-serif text-gold tracking-widest" onClick={() => setMenuOpen(false)}>
                    TAVORA
                </Link>
                <div className="hidden md:flex items-center space-x-8">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm text-warm-gray hover:text-gold transition-colors tracking-wider uppercase"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
                <div className="flex items-center gap-5">
                    <CartIcon />
                    {/* Mobile menu button */}
                    <button
                        className="md:hidden text-warm-gray hover:text-gold transition-colors"
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        {menuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu panel */}
            {menuOpen && (
                <div className="md:hidden border-t border-warm-gray/10 bg-obsidian/95 backdrop-blur-md">
                    <div className="px-6 py-6 flex flex-col space-y-5">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className="text-sm text-warm-gray hover:text-gold transition-colors tracking-wider uppercase"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
