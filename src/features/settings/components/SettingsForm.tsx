"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { siteSettingsSchema, SiteSettings } from "../types";
import { updateSiteSettingsAction } from "../actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";

export function SettingsForm({ initialData }: { initialData: SiteSettings }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<SiteSettings>({
        // @ts-ignore: Zod coerce/default types conflict with RHF resolver types
        resolver: zodResolver(siteSettingsSchema),
        defaultValues: initialData,
    });

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const res = await updateSiteSettingsAction(data);
            if (res.success) {
                toast.success("Settings saved");
            } else {
                toast.error(res.error || "Failed to save settings");
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const field = (id: keyof SiteSettings, label: string, opts?: { placeholder?: string; type?: string }) => (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-warm-gray">{label}</Label>
            <Input id={id} type={opts?.type} placeholder={opts?.placeholder} {...form.register(id)} className="bg-gunmetal border-warm-gray/20 text-white" />
            {form.formState.errors[id] && <p className="text-red-500 text-xs">{form.formState.errors[id]?.message as string}</p>}
        </div>
    );

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4 bg-charcoal p-6 rounded-lg border border-warm-gray/10">
                <h3 className="text-white font-medium">General</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {field("siteName", "Site Name")}
                    {field("siteEmail", "Contact Email", { type: "email" })}
                    {field("sitePhone", "Contact Phone")}
                    {field("address", "Address")}
                </div>
            </div>

            <div className="space-y-4 bg-charcoal p-6 rounded-lg border border-warm-gray/10">
                <h3 className="text-white font-medium">WhatsApp</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {field("whatsappNumber", "WhatsApp Number", { placeholder: "923144293848 (country code, no +, no spaces)" })}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="whatsappMessage" className="text-warm-gray">Default WhatsApp Message</Label>
                    <Input id="whatsappMessage" {...form.register("whatsappMessage")} className="bg-gunmetal border-warm-gray/20 text-white" />
                </div>
            </div>

            <div className="space-y-4 bg-charcoal p-6 rounded-lg border border-warm-gray/10">
                <h3 className="text-white font-medium">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {field("facebookUrl", "Facebook URL", { placeholder: "https://facebook.com/..." })}
                    {field("instagramUrl", "Instagram URL", { placeholder: "https://instagram.com/..." })}
                    {field("tiktokUrl", "TikTok URL", { placeholder: "https://tiktok.com/..." })}
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="bg-gold text-black hover:bg-gold-light w-full md:w-auto">
                    {isSubmitting ? "Saving..." : "Save Settings"}
                </Button>
            </div>
        </form>
    );
}
