"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCategorySchema, CreateCategoryInput } from "../types";
import { createCategoryAction } from "../actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export function AddCategoryDialog() {
    const [open, setOpen] = useState(false);
    const form = useForm<CreateCategoryInput>({
        resolver: zodResolver(createCategorySchema),
        defaultValues: { name: "", description: "", isVisible: true },
    });

    const onSubmit = async (data: CreateCategoryInput) => {
        const result = await createCategoryAction(data);
        if (result.success) {
            toast.success("Category created");
            form.reset();
            setOpen(false);
        } else {
            toast.error(result.error || "Failed to create category");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gold text-black hover:bg-gold-light">
                    <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-gunmetal border-warm-gray/20 text-white">
                <DialogHeader>
                    <DialogTitle className="font-serif text-gold">New Category</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label className="text-warm-gray">Name</Label>
                        <Input {...form.register("name")} className="bg-charcoal border-warm-gray/20 text-white" />
                        {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className="text-warm-gray">Description</Label>
                        <Input {...form.register("description")} className="bg-charcoal border-warm-gray/20 text-white" />
                    </div>
                    <Button type="submit" className="w-full bg-gold text-black hover:bg-gold-light">
                        Create Category
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
