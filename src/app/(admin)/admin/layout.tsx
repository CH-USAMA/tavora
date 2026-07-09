"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Folders, Images, Settings, LogOut, Home, Users, Star, Menu, X } from "lucide-react";
import { authClient } from "@/shared/lib/auth/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: Folders },
    { name: "Collections", href: "/admin/collections", icon: Folders },
    { name: "Homepage Config", href: "/admin/homepage", icon: Home },
    { name: "Testimonials", href: "/admin/testimonials", icon: Star },
    { name: "Media Library", href: "/admin/media", icon: Images },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/admin/login");
    };

    return (
        <div className="flex h-screen bg-black overflow-hidden">
            {/* Mobile backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <div
                className={`
                    fixed inset-y-0 left-0 z-50 w-64 flex-shrink-0 bg-gunmetal border-r border-warm-gray/10 flex flex-col
                    transition-transform duration-200 ease-in-out
                    lg:static lg:translate-x-0
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                <div className="h-16 flex items-center justify-between px-6 border-b border-warm-gray/10">
                    <h1 className="text-xl font-bold font-serif text-gold">Tavora Admin</h1>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-warm-gray hover:text-white"
                        aria-label="Close menu"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="px-3 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                                        group flex items-center px-3 py-2 text-sm font-medium rounded-md
                                        ${isActive
                                            ? "bg-gold/10 text-gold"
                                            : "text-warm-gray hover:bg-white/5 hover:text-white"}
                                    `}
                                >
                                    <item.icon
                                        className={`
                                            mr-3 flex-shrink-0 h-5 w-5
                                            ${isActive ? "text-gold" : "text-warm-gray group-hover:text-white"}
                                        `}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                <div className="p-4 border-t border-warm-gray/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2 text-sm font-medium text-warm-gray rounded-md hover:bg-white/5 hover:text-white"
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden bg-charcoal w-full min-w-0">
                <header className="h-16 flex items-center justify-between px-4 sm:px-8 border-b border-warm-gray/10 bg-gunmetal/50">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-warm-gray hover:text-white shrink-0"
                            aria-label="Open menu"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <h2 className="text-lg font-medium text-white capitalize truncate">
                            {pathname.split("/").pop() || "Dashboard"}
                        </h2>
                    </div>
                    <div className="flex items-center shrink-0">
                        {/* Add user avatar/info here if needed */}
                        <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-black font-bold">
                            A
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-4 sm:p-8 text-white">
                    {children}
                </main>
            </div>
        </div>
    );
}
