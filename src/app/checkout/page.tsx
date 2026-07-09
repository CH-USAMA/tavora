import { Navbar } from "@/features/storefront/components/Navbar";
import { Footer } from "@/features/storefront/components/Footer";
import { CheckoutForm } from "@/features/cart/components/CheckoutForm";
import { SettingsService } from "@/features/settings/service";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Checkout | Tavora",
};

export default async function CheckoutPage() {
    const settings = await SettingsService.getSiteSettings();

    return (
        <div className="min-h-screen flex flex-col bg-obsidian">
            <Navbar />
            <main className="flex-grow pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-serif text-white mb-12">Checkout</h1>
                    <CheckoutForm whatsappNumber={settings.whatsappNumber} />
                </div>
            </main>
            <Footer />
        </div>
    );
}
