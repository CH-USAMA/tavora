"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../CartContext";
import { createOrderAction } from "@/features/orders/actions";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { CheckCircle2 } from "lucide-react";

interface CheckoutFormProps {
    whatsappNumber: string;
}

export function CheckoutForm({ whatsappNumber }: CheckoutFormProps) {
    const { items, subtotal, clearCart, isLoaded } = useCart();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [completedOrder, setCompletedOrder] = useState<{ orderNumber: string; whatsappUrl: string } | null>(null);

    if (completedOrder) {
        return (
            <div className="max-w-lg mx-auto text-center py-16 bg-charcoal border border-warm-gray/10 px-8">
                <CheckCircle2 className="w-12 h-12 text-gold mx-auto mb-6" />
                <h2 className="text-2xl font-serif text-white mb-2">Order {completedOrder.orderNumber} placed</h2>
                <p className="text-warm-gray text-sm mb-8">
                    Continue to WhatsApp to confirm your order with our team.
                </p>
                <a
                    href={completedOrder.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#20c55a] text-white transition-all uppercase tracking-[0.2em] text-sm font-medium"
                >
                    Continue to WhatsApp
                </a>
                <div className="mt-6">
                    <Link href="/shop" className="text-warm-gray text-sm hover:text-gold transition-colors">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoaded && items.length === 0) {
        return (
            <div className="text-center py-24">
                <p className="text-warm-gray/50 text-lg font-serif">Your cart is empty</p>
                <Link href="/shop" className="text-gold text-sm mt-4 inline-block hover:text-gold-light transition-colors uppercase tracking-widest">
                    Browse Timepieces
                </Link>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await createOrderAction({
                customerName: name,
                customerPhone: phone,
                customerAddress: address || undefined,
                notes: notes || undefined,
                items: items.map((i) => ({
                    productId: i.productId,
                    title: i.title,
                    image: i.image,
                    price: i.price,
                    quantity: i.quantity,
                })),
            });

            if (!res.success || !res.orderNumber) {
                toast.error(res.error || "Failed to place order");
                setIsSubmitting(false);
                return;
            }

            const lines = items.map((i) => `• ${i.title} x${i.quantity} — Rs. ${(i.price * i.quantity).toLocaleString()}`).join("\n");
            const message =
                `Hi! I'd like to place order ${res.orderNumber}:\n\n${lines}\n\n` +
                `Subtotal: Rs. ${res.subtotal!.toLocaleString()}\n\n` +
                `Name: ${name}\nPhone: ${phone}` +
                (address ? `\nAddress: ${address}` : "") +
                (notes ? `\nNotes: ${notes}` : "");
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

            clearCart();
            setCompletedOrder({ orderNumber: res.orderNumber, whatsappUrl });
        } catch (err) {
            toast.error("Something went wrong placing your order");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6 bg-charcoal border border-warm-gray/10 p-6">
                <h3 className="text-white text-lg font-serif">Your Details</h3>
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-warm-gray">Full Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="bg-gunmetal border-warm-gray/20 text-white" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone" className="text-warm-gray">WhatsApp Phone Number</Label>
                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="03XXXXXXXXX" className="bg-gunmetal border-warm-gray/20 text-white" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="address" className="text-warm-gray">Delivery Address (optional)</Label>
                    <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="bg-gunmetal border-warm-gray/20 text-white" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="notes" className="text-warm-gray">Order Notes (optional)</Label>
                    <textarea
                        id="notes"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="flex w-full rounded-md border border-warm-gray/20 bg-gunmetal px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
                    />
                </div>
            </div>

            <div className="lg:col-span-1">
                <div className="sticky top-28 bg-charcoal border border-warm-gray/10 p-6 space-y-4">
                    <h3 className="text-white text-lg font-serif">Order Summary</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {items.map((i) => (
                            <div key={i.productId} className="flex justify-between text-sm gap-2">
                                <span className="text-warm-gray line-clamp-1">{i.title} x{i.quantity}</span>
                                <span className="text-white shrink-0">Rs. {(i.price * i.quantity).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between border-t border-warm-gray/10 pt-4 text-sm font-medium">
                        <span className="text-white">Subtotal</span>
                        <span className="text-gold">Rs. {subtotal.toLocaleString()}</span>
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full bg-gold text-black hover:bg-gold-light">
                        {isSubmitting ? "Placing Order..." : "Checkout via WhatsApp"}
                    </Button>
                </div>
            </div>
        </form>
    );
}
