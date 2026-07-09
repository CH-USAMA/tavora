"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTestimonialSchema, CreateTestimonialInput } from "../types";
import { createTestimonialAction, updateTestimonialAction } from "../actions";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { toast } from "sonner";
import { useState } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";

interface TestimonialFormProps {
    initialData?: CreateTestimonialInput;
    testimonialId?: string;
}

export function TestimonialForm({ initialData, testimonialId }: TestimonialFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const isEditing = !!testimonialId;

    const form = useForm<CreateTestimonialInput>({
        // @ts-ignore: Zod coerce/default types conflict with RHF resolver types
        resolver: zodResolver(createTestimonialSchema),
        defaultValues: initialData || {
            name: "",
            role: "",
            content: "",
            avatar: "",
            rating: 5,
            isVisible: true,
            sortOrder: 0
        }
    });

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`;
            const blob = await upload(uniqueFilename, file, {
                access: 'public',
                handleUploadUrl: '/api/upload',
            });
            form.setValue("avatar", blob.url);
            toast.success("Avatar uploaded successfully");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload avatar");
        } finally {
            setIsUploading(false);
        }
    };

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const res = isEditing
                ? await updateTestimonialAction(testimonialId, data)
                : await createTestimonialAction(data);

            if (res.success) {
                toast.success(isEditing ? "Testimonial updated" : "Testimonial created");
                router.push("/admin/testimonials");
                router.refresh();
            } else {
                toast.error(res.error || "Failed to save testimonial");
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
                    <Label htmlFor="role" className="text-warm-gray">Role / Title</Label>
                    <Input id="role" placeholder="e.g. Verified Buyer" {...form.register("role")} className="bg-gunmetal border-warm-gray/20 text-white" />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="content" className="text-warm-gray">Testimonial</Label>
                    <textarea
                        id="content"
                        rows={4}
                        {...form.register("content")}
                        className="flex w-full rounded-md border border-warm-gray/20 bg-gunmetal px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
                    />
                    {form.formState.errors.content && <p className="text-red-500 text-xs">{form.formState.errors.content.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="rating" className="text-warm-gray">Rating (1-5)</Label>
                    <Input id="rating" type="number" min={1} max={5} {...form.register("rating")} className="bg-gunmetal border-warm-gray/20 text-white" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="sortOrder" className="text-warm-gray">Sort Order</Label>
                    <Input id="sortOrder" type="number" {...form.register("sortOrder")} className="bg-gunmetal border-warm-gray/20 text-white" />
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
                    <Label className="text-warm-gray">Avatar (optional)</Label>
                    <div className="flex items-center gap-6 mt-2">
                        {form.watch("avatar") && (
                            <div className="relative h-16 w-16 rounded-full overflow-hidden bg-obsidian border border-warm-gray/20">
                                <Image src={form.watch("avatar")!} alt="Preview" fill className="object-cover" />
                            </div>
                        )}
                        <div>
                            <input type="file" id="avatar" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                            <Label htmlFor="avatar" className="cursor-pointer bg-gold text-black px-4 py-2 rounded-md hover:bg-gold-light transition-colors text-sm font-medium">
                                {isUploading ? "Uploading..." : "Upload Avatar"}
                            </Label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="bg-gold text-black hover:bg-gold-light w-full md:w-auto">
                    {isSubmitting ? "Saving..." : isEditing ? "Update Testimonial" : "Create Testimonial"}
                </Button>
            </div>
        </form>
    );
}
