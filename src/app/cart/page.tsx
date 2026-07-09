import { Navbar } from "@/features/storefront/components/Navbar";
import { Footer } from "@/features/storefront/components/Footer";
import { CartPageContent } from "@/features/cart/components/CartPageContent";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Your Cart | Tavora",
};

export default function CartPage() {
    return (
        <div className="min-h-screen flex flex-col bg-obsidian">
            <Navbar />
            <main className="flex-grow pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-serif text-white mb-12">Your Cart</h1>
                    <CartPageContent />
                </div>
            </main>
            <Footer />
        </div>
    );
}
