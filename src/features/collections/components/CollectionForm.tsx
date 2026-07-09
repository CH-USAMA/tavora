"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCollectionSchema, CreateCollectionInput } from "../types";
import { createCollectionAction, updateCollectionAction } from "../actions";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";

interface CollectionFormProps {
    initialData?: CreateCollectionInput;
    collectionId?: string;
}

export function CollectionForm({ initialData, collectionId }: CollectionFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const isEditing = !!collectionId;

    const form = useForm<CreateCollectionInput>({
        // @ts-ignore: Zod coerce/default types conflict with RHF resolver types
        resolver: zodResolver(createCollectionSchema),
        defaultValues: initialData || {
            name: "",
            slug: "",
            description: "",
            image: "",
            isVisible: true,
            sortOrder: 0
        }
    });

    const watchedName = form.watch("name");
    const watchedSlug = form.watch("slug");

    useEffect(() => {
        if (!initialData && watchedName && !form.formState.dirtyFields.slug && !watchedSlug) {
            const generatedSlug = watchedName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");
            form.setValue("slug", generatedSlug, { shouldValidate: true, shouldDirty: false });
        }
    }, [watchedName, initialData, form, watchedSlug]);

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
                ? await updateCollectionAction(collectionId, data)
                : await createCollectionAction(data);

            if (res.success) {
                toast.success(isEditing ? "Collection updated" : "Collection created");
                router.push("/admin/collections");
                router.refresh();
            } else {
                toast.error(res.error || "Failed to save collection");
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
                    <Label htmlFor="name" className="text-warm-gray">Name</Label>
                    <Input id="name" {...form.register("name")} className="bg-gunmetal border-warm-gray/20 text-white" />
                    {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="slug" className="text-warm-gray">Slug</Label>
                    <Input id="slug" {...form.register("slug")} className="bg-gunmetal border-warm-gray/20 text-white" />
                    {form.formState.errors.slug && <p className="text-red-500 text-xs">{form.formState.errors.slug.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description" className="text-warm-gray">Description</Label>
                    <Input id="description" {...form.register("description")} className="bg-gunmetal border-warm-gray/20 text-white" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="sortOrder" className="text-warm-gray">Sort Order</Label>
                    <Input id="sortOrder" type="number" {...form.register("sortOrder")} className="bg-gunmetal border-warm-gray/20 text-white" />
                </div>
                <div className="space-y-2 flex items-center h-full pt-6">
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
                    <Label className="text-warm-gray">Collection Image</Label>
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
                    {isSubmitting ? "Saving..." : isEditing ? "Update Collection" : "Create Collection"}
                </Button>
            </div>
        </form>
    );
}
