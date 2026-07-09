"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteHomepageSectionAction } from "../actions";
import { toast } from "sonner";

export function DeleteHomepageSectionButton({ id, label }: { id: string, label: string }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete the "${label}" section? This action cannot be undone.`)) {
            return;
        }

        setIsDeleting(true);
        try {
            const result = await deleteHomepageSectionAction(id);
            if (result.success) {
                toast.success("Section deleted");
            } else {
                toast.error(result.error || "Failed to delete section");
            }
        } catch (error) {
            toast.error("An error occurred");
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
            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
        >
            {isDeleting ? "..." : <Trash2 className="h-4 w-4" />}
        </Button>
    );
}
