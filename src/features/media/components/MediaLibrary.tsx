"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Trash2, Copy, Upload } from "lucide-react";
import { deleteMediaAction, listMediaAction } from "../actions";

interface MediaItem {
    url: string;
    pathname: string;
    size: number;
    uploadedAt: string;
}

interface MediaLibraryProps {
    initialBlobs: MediaItem[];
    initialCursor?: string;
    initialHasMore: boolean;
}

function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibrary({ initialBlobs, initialCursor, initialHasMore }: MediaLibraryProps) {
    const [items, setItems] = useState<MediaItem[]>(initialBlobs);
    const [cursor, setCursor] = useState(initialCursor);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        try {
            const uploaded = await Promise.all(Array.from(files).map(file => {
                const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`;
                return upload(uniqueFilename, file, {
                    access: 'public',
                    handleUploadUrl: '/api/upload',
                });
            }));

            const newItems: MediaItem[] = uploaded.map(blob => ({
                url: blob.url,
                pathname: blob.pathname,
                size: 0,
                uploadedAt: new Date().toISOString(),
            }));
            setItems(prev => [...newItems, ...prev]);
            toast.success("Upload complete");
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDelete = async (url: string) => {
        if (!confirm("Delete this file? This cannot be undone.")) return;
        setDeletingUrl(url);
        try {
            const res = await deleteMediaAction(url);
            if (res.success) {
                setItems(prev => prev.filter(i => i.url !== url));
                toast.success("File deleted");
            } else {
                toast.error(res.error || "Failed to delete");
            }
        } finally {
            setDeletingUrl(null);
        }
    };

    const handleCopy = (url: string) => {
        navigator.clipboard.writeText(url);
        toast.success("URL copied to clipboard");
    };

    const handleLoadMore = async () => {
        setIsLoadingMore(true);
        try {
            const res = await listMediaAction(cursor);
            if (res.success) {
                setItems(prev => [...prev, ...res.blobs]);
                setCursor(res.cursor);
                setHasMore(res.hasMore);
            } else {
                toast.error(res.error || "Failed to load more");
            }
        } finally {
            setIsLoadingMore(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <input type="file" accept="image/*" multiple ref={fileInputRef} className="hidden" onChange={handleUpload} />
                <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="bg-gold text-black hover:bg-gold-light">
                    <Upload className="mr-2 h-4 w-4" /> {isUploading ? "Uploading..." : "Upload Files"}
                </Button>
            </div>

            {items.length === 0 ? (
                <div className="p-12 bg-gunmetal rounded-lg border border-warm-gray/10 text-center text-warm-gray">
                    No media files yet. Upload your first image.
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {items.map((item) => (
                        <div key={item.url} className="group relative bg-gunmetal rounded-md border border-warm-gray/10 overflow-hidden">
                            <div className="relative aspect-square bg-charcoal">
                                <Image src={item.url} alt={item.pathname} fill className="object-cover" unoptimized />
                            </div>
                            <div className="p-2">
                                <p className="text-xs text-warm-gray truncate" title={item.pathname}>{item.pathname}</p>
                                {item.size > 0 && <p className="text-[10px] text-warm-gray/50">{formatSize(item.size)}</p>}
                            </div>
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button size="sm" variant="secondary" onClick={() => handleCopy(item.url)} title="Copy URL">
                                    <Copy className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDelete(item.url)} disabled={deletingUrl === item.url} title="Delete">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {hasMore && (
                <div className="flex justify-center">
                    <Button variant="outline" onClick={handleLoadMore} disabled={isLoadingMore} className="border-warm-gray/20 text-warm-gray hover:text-white">
                        {isLoadingMore ? "Loading..." : "Load More"}
                    </Button>
                </div>
            )}
        </div>
    );
}
