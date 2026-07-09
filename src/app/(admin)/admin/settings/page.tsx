import { SettingsForm } from "@/features/settings/components/SettingsForm";
import { SettingsService } from "@/features/settings/service";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
    const settings = await SettingsService.getSiteSettings();

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h2 className="text-2xl font-bold text-white font-serif">Settings</h2>
                <p className="text-sm text-warm-gray mt-1">Configure your WhatsApp number and site-wide details.</p>
            </div>

            <SettingsForm initialData={settings} />
        </div>
    );
}
