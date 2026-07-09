"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createHomepageSectionSchema, CreateHomepageSectionInput, sectionTypes, sectionTypeLabels } from "../types";
import { createHomepageSectionAction, updateHomepageSectionAction } from "../actions";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { toast } from "sonner";
import { useState } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";

interface HomepageSectionFormProps {
    initialData?: CreateHomepageSectionInput;
    sectionId?: string;
}

export function HomepageSectionForm({ initialData, sectionId }: HomepageSectionFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const isEditing = !!sectionId;

    const form = useForm<CreateHomepageSectionInput>({
        // @ts-ignore: Zod coerce/default types conflict with RHF resolver types
        resolver: zodResolver(createHomepageSectionSchema),
        defaultValues: initialData || {
            type: "text_banner",
            title: "",
            subtitle: "",
            image: "",
            buttonText: "",
            buttonLink: "",
            sortOrder: 0,
            isVisible: true,
        }
    });

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`;
            const blob = await upload(uniqueFilename, file, {
                access: 'public',
                handleUploadUrl: '/api/upload',
            });
            form.setValue("image", blob.url);
            toast.success("Image uploaded successfully");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const res = isEditing
                ? await updateHomepageSectionAction(sectionId, data)
                : await createHomepageSectionAction(data);

            if (res.success) {
                toast.success(isEditing ? "Section updated" : "Section created");
                router.push("/admin/homepage");
                router.refresh();
            } else {
                toast.error(res.error || "Failed to save section");
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-charcoal p-6 rounded-lg border border-warm-gray/10">
                <div className="space-y-2">
                    <Label htmlFor="type" className="text-warm-gray">Section Type</Label>
                    <select
                        id="type"
                        {...form.register("type")}
                        className="flex h-10 w-full rounded-md border border-warm-gray/20 bg-gunmetal px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
                    >
                        {sectionTypes.map(t => (
                            <option key={t} value={t}>{sectionTypeLabels[t]}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="sortOrder" className="text-warm-gray">Sort Order</Label>
                    <Input id="sortOrder" type="number" {...form.register("sortOrder")} className="bg-gunmetal border-warm-gray/20 text-white" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-warm-gray">Title</Label>
                    <Input id="title" {...form.register("title")} className="bg-gunmetal border-warm-gray/20 text-white" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="subtitle" className="text-warm-gray">Subtitle</Label>
                    <Input id="subtitle" {...form.register("subtitle")} className="bg-gunmetal border-warm-gray/20 text-white" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="buttonText" className="text-warm-gray">Button Text</Label>
                    <Input id="buttonText" {...form.register("buttonText")} className="bg-gunmetal border-warm-gray/20 text-white" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="buttonLink" className="text-warm-gray">Button Link</Label>
                    <Input id="buttonLink" placeholder="/shop" {...form.register("buttonLink")} className="bg-gunmetal border-warm-gray/20 text-white" />
                </div>
                <div className="space-y-2 flex items-center h-full">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isVisible"
                            checked={form.watch("isVisible")}
                            onCheckedChange={(c) => form.setValue("isVisible", !!c)}
                        />
                        <Label htmlFor="isVisible" className="text-warm-gray">Visible on Storefront</Label>
                    </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label className="text-warm-gray">Section Image</Label>
                    <div className="flex items-center gap-6 mt-2">
                        {form.watch("image") && (
                            <div className="relative h-24 w-24 rounded-md overflow-hidden bg-obsidian border border-warm-gray/20">
                                <Image src={form.watch("image")!} alt="Preview" fill className="object-cover" />
                            </div>
                        )}
                        <div>
                            <input type="file" id="image" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            <Label htmlFor="image" className="cursor-pointer bg-gold text-black px-4 py-2 rounded-md hover:bg-gold-light transition-colors text-sm font-medium">
                                {isUploading ? "Uploading..." : "Upload Image"}
                            </Label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="bg-gold text-black hover:bg-gold-light w-full md:w-auto">
                    {isSubmitting ? "Saving..." : isEditing ? "Update Section" : "Create Section"}
                </Button>
            </div>
        </form>
    );
}
