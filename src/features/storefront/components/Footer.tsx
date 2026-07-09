import Link from "next/link";
import { SettingsService } from "@/features/settings/service";

export async function Footer() {
    const settings = await SettingsService.getSiteSettings();

    return (
        <footer className="bg-obsidian border-t border-warm-gray/10 py-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="md:col-span-1">
                        <h3 className="font-serif text-2xl text-gold tracking-widest mb-4">{settings.siteName.toUpperCase()}</h3>
                        <p className="text-warm-gray text-sm leading-relaxed">
                            A new standard of luxury. Curated timepieces for the discerning collector.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white text-xs tracking-widest uppercase mb-4">Shop</h4>
                        <ul className="space-y-2">
                            <li><Link href="/shop" className="text-warm-gray text-sm hover:text-gold transition-colors">All Timepieces</Link></li>
                            <li><Link href="/shop?sort=newest" className="text-warm-gray text-sm hover:text-gold transition-colors">New Arrivals</Link></li>
                            <li><Link href="/#featured" className="text-warm-gray text-sm hover:text-gold transition-colors">Featured</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white text-xs tracking-widest uppercase mb-4">Company</h4>
                        <ul className="space-y-2">
                            <li><Link href="/#about" className="text-warm-gray text-sm hover:text-gold transition-colors">About</Link></li>
                            <li><Link href="/#about" className="text-warm-gray text-sm hover:text-gold transition-colors">Our Story</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white text-xs tracking-widest uppercase mb-4">Contact</h4>
                        {settings.siteEmail && (
                            <a href={`mailto:${settings.siteEmail}`} className="block text-warm-gray text-sm mb-1 hover:text-gold transition-colors">
                                {settings.siteEmail}
                            </a>
                        )}
                        {settings.sitePhone && (
                            <a href={`tel:${settings.sitePhone.replace(/\s+/g, "")}`} className="block text-warm-gray text-sm mb-4 hover:text-gold transition-colors">
                                {settings.sitePhone}
                            </a>
                        )}
                        <div className="flex space-x-4 mt-4">
                            {settings.instagramUrl && (
                                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-warm-gray hover:text-gold transition-colors" aria-label="Instagram">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                                </a>
                            )}
                            {settings.facebookUrl && (
                                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-warm-gray hover:text-gold transition-colors" aria-label="Facebook">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                </a>
                            )}
                            {settings.tiktokUrl && (
                                <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-warm-gray hover:text-gold transition-colors" aria-label="TikTok">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.589 6.686a4.793 4.793 0 01-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 01-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 013.183-4.51v-3.5a6.329 6.329 0 00-5.394 10.692 6.33 6.33 0 0010.857-4.424V8.687a8.182 8.182 0 004.773 1.526V6.79a4.831 4.831 0 01-1.003-.104z"/></svg>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
                <div className="border-t border-warm-gray/10 pt-8 text-center">
                    <p className="text-warm-gray/50 text-xs tracking-wider">
                        &copy; {new Date().getFullYear()} {settings.siteName}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
