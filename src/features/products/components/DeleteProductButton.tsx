"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteProductAction } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeleteProductButton({ id, productName }: { id: string, productName: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${productName}? This action cannot be undone.`)) {
            return;
        }

        setIsDeleting(true);
        try {
            const result = await deleteProductAction(id);
            if (result.success) {
                toast.success("Product deleted successfully");
                router.refresh();
            } else {
                toast.error(result.error || "Failed to delete product");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
        >
            {isDeleting ? "Deleting..." : <Trash2 className="w-4 h-4" />}
        </Button>
    );
}
