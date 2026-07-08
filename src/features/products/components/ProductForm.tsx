"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema, CreateProductInput } from "../types";
import { createProductAction } from "../actions";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { upload } from "@vercel/blob/client";
import Image from "next/image";

export function ProductForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<CreateProductInput>({
        // @ts-ignore: Zod coerce types conflict with RHF resolver types
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            title: "",
            sku: "",
            price: 0,
            salePrice: "",
            description: "",
            brand: "Tavora",
            externalUrl: "",
            imageUrl: "",
            isVisible: true,
            isFeatured: false,
        },
    });

    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const newBlob = await upload(file.name, file, {
                access: 'public',
                handleUploadUrl: '/api/upload',
            });
            form.setValue("imageUrl", newBlob.url);
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
            // Convert empty string salePrice to undefined or number if needed
            const result = await createProductAction(data);
            if (result.success) {
                toast.success("Product created successfully");
                router.push("/admin/products");
            } else {
                toast.error(result.error || "Failed to create product");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-warm-gray">Product Title</Label>
                    <Input id="title" {...form.register("title")} className="bg-charcoal border-warm-gray/20 text-white" />
                    {form.formState.errors.title && <p className="text-red-500 text-xs">{form.formState.errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="sku" className="text-warm-gray">SKU</Label>
                    <Input id="sku" {...form.register("sku")} className="bg-charcoal border-warm-gray/20 text-white" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="price" className="text-warm-gray">Price (Rs)</Label>
                    <Input id="price" type="number" step="0.01" {...form.register("price")} className="bg-charcoal border-warm-gray/20 text-white" />
                    {form.formState.errors.price && <p className="text-red-500 text-xs">{form.formState.errors.price.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="externalUrl" className="text-warm-gray">Markaz Dropshipping URL</Label>
                    <Input id="externalUrl" type="url" {...form.register("externalUrl")} placeholder="https://..." className="bg-charcoal border-warm-gray/20 text-white" />
                    {form.formState.errors.externalUrl && <p className="text-red-500 text-xs">{form.formState.errors.externalUrl.message}</p>}
                </div>
                
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description" className="text-warm-gray">Description</Label>
                    <textarea 
                        id="description" 
                        {...form.register("description")} 
                        className="flex min-h-[120px] w-full rounded-md border border-warm-gray/20 bg-charcoal px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
                    />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label className="text-warm-gray">Product Image</Label>
                    <div className="mt-2 flex items-center gap-6">
                        <div 
                            className="flex h-32 w-32 items-center justify-center rounded-md border-2 border-dashed border-warm-gray/30 bg-gunmetal overflow-hidden relative"
                        >
                            {form.watch("imageUrl") ? (
                                <Image
                                    src={form.watch("imageUrl") as string}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <span className="text-xs text-warm-gray/50 uppercase tracking-widest text-center px-2">No Image</span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                            />
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="border-gold/50 text-gold hover:bg-gold hover:text-black transition-colors"
                            >
                                {isUploading ? "Uploading..." : "Upload Image"}
                            </Button>
                            <p className="text-xs text-warm-gray/60">JPG, PNG, WebP up to 5MB</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex space-x-6 p-4 bg-charcoal rounded-md border border-warm-gray/10">
                <div className="flex items-center space-x-2">
                    <Checkbox 
                        id="isVisible" 
                        checked={form.watch("isVisible")} 
                        onCheckedChange={(checked) => form.setValue("isVisible", checked as boolean)} 
                        className="border-warm-gray data-[state=checked]:bg-gold data-[state=checked]:text-black"
                    />
                    <Label htmlFor="isVisible" className="text-warm-gray">Visible on Storefront</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox 
                        id="isFeatured" 
                        checked={form.watch("isFeatured")} 
                        onCheckedChange={(checked) => form.setValue("isFeatured", checked as boolean)}
                        className="border-warm-gray data-[state=checked]:bg-gold data-[state=checked]:text-black"
                    />
                    <Label htmlFor="isFeatured" className="text-warm-gray">Featured Product</Label>
                </div>
            </div>

            <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => router.back()} className="border-warm-gray/20 text-warm-gray hover:bg-white/5 hover:text-white">
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-gold text-black hover:bg-gold-light">
                    {isSubmitting ? "Saving..." : "Save Product"}
                </Button>
            </div>
        </form>
    );
}
