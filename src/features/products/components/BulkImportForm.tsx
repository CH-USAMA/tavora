"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { createProductAction } from "@/features/products/actions";
import { Upload, FileText } from "lucide-react";

interface BulkImportFormProps {
    categories: { id: string; name: string; slug: string }[];
    collections: { id: string; name: string; slug: string }[];
}

function resolveId(value: string | undefined, list: { id: string; name: string; slug: string }[]) {
    if (!value) return undefined;
    const needle = value.trim().toLowerCase();
    if (!needle) return undefined;
    const match = list.find(
        (item) => item.slug.toLowerCase() === needle || item.name.toLowerCase() === needle
    );
    return match?.id;
}

export function BulkImportForm({ categories, collections }: BulkImportFormProps) {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0 });

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                if (results.errors.length > 0) {
                    toast.error("Error parsing CSV. Please check the format.");
                    return;
                }

                const rows = results.data as any[];
                if (rows.length === 0) {
                    toast.error("CSV file is empty.");
                    return;
                }

                setIsProcessing(true);
                setProgress({ current: 0, total: rows.length });
                let successCount = 0;
                let failCount = 0;

                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];
                    try {
                        const price = parseFloat(row.price);
                        const salePrice = row.salePrice ? parseFloat(row.salePrice) : undefined;

                        const productData = {
                            title: row.title || "Untitled Product",
                            sku: row.sku || `TAV-${Date.now().toString().slice(-6)}-${i}`,
                            price: isNaN(price) ? 0 : price,
                            salePrice: salePrice && !isNaN(salePrice) ? salePrice : undefined,
                            brand: row.brand || "Tavora",
                            description: row.description || "",
                            externalUrl: row.externalUrl || "",
                            categoryId: resolveId(row.category, categories),
                            collectionId: resolveId(row.collection, collections),
                            isBestSeller: String(row.isBestSeller).toLowerCase() === 'true',
                            isNewArrival: String(row.isNewArrival).toLowerCase() === 'true',
                            isVisible: String(row.isVisible).toLowerCase() !== 'false',
                            isFeatured: String(row.isFeatured).toLowerCase() === 'true',
                            images: row.images ? row.images.split(",").map((s: string) => s.trim()).filter(Boolean) : []
                        };

                        const res = await createProductAction(productData as any);
                        if (res.success) {
                            successCount++;
                        } else {
                            failCount++;
                            console.error(`Failed to import row ${i + 1}:`, res.error);
                        }
                    } catch (err) {
                        failCount++;
                        console.error(`Failed to import row ${i + 1}:`, err);
                    }
                    setProgress({ current: i + 1, total: rows.length });
                }

                setIsProcessing(false);
                toast.success(`Import complete! ${successCount} successful, ${failCount} failed.`);
                if (successCount > 0) {
                    setTimeout(() => {
                        router.push("/admin/products");
                        router.refresh();
                    }, 2000);
                }
            }
        });
    };

    const handleDownloadSample = () => {
        const sampleHeaders = ["title", "price", "sku", "salePrice", "brand", "description", "category", "collection", "images", "isBestSeller", "isNewArrival", "isFeatured", "isVisible"];
        const sampleRow = ["Rolex Submariner", "1500000", "TAV-ROLEX-SUB", "1450000", "Rolex", "<p>A classic timepiece.</p>", categories[0]?.slug || "", collections[0]?.slug || "", "https://example.com/image1.jpg, https://example.com/image2.jpg", "true", "true", "false", "true"];
        const csvContent = [sampleHeaders.join(","), sampleRow.join(",")].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "tavora_sample_products.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-end">
                <Button onClick={handleDownloadSample} variant="outline" className="border-warm-gray/20 text-warm-gray hover:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Download Sample CSV
                </Button>
            </div>

            <div className="bg-charcoal rounded-lg p-8 border border-warm-gray/10">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg text-white font-medium mb-2">CSV Format Requirements</h3>
                        <p className="text-sm text-warm-gray mb-4">Your CSV must include a header row with the following exact column names:</p>
                        <ul className="grid grid-cols-2 gap-2 text-sm text-warm-gray/80 bg-obsidian p-4 rounded-md">
                            <li>• <code className="text-gold">title</code> (Required)</li>
                            <li>• <code className="text-gold">price</code> (Required, number)</li>
                            <li>• <code className="text-gold">sku</code> (Optional)</li>
                            <li>• <code className="text-gold">salePrice</code> (Optional, number)</li>
                            <li>• <code className="text-gold">brand</code> (Optional)</li>
                            <li>• <code className="text-gold">description</code> (Optional)</li>
                            <li>• <code className="text-gold">category</code> (Optional, slug or name)</li>
                            <li>• <code className="text-gold">collection</code> (Optional, slug or name)</li>
                            <li>• <code className="text-gold">images</code> (Optional, comma-separated URLs)</li>
                            <li>• <code className="text-gold">isBestSeller</code> (Optional, true/false)</li>
                            <li>• <code className="text-gold">isNewArrival</code> (Optional, true/false)</li>
                            <li>• <code className="text-gold">isFeatured</code> (Optional, true/false)</li>
                            <li>• <code className="text-gold">isVisible</code> (Optional, true/false)</li>
                        </ul>
                        {categories.length > 0 && (
                            <p className="text-xs text-warm-gray/60 mt-3">
                                Available category slugs: {categories.map(c => c.slug).join(", ")}
                            </p>
                        )}
                        {collections.length > 0 && (
                            <p className="text-xs text-warm-gray/60 mt-1">
                                Available collection slugs: {collections.map(c => c.slug).join(", ")}
                            </p>
                        )}
                    </div>

                    <div className="border-2 border-dashed border-warm-gray/20 rounded-lg p-12 text-center relative hover:border-gold/50 transition-colors">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            disabled={isProcessing}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <div className="flex flex-col items-center gap-4">
                            <Upload className="w-10 h-10 text-warm-gray/50" />
                            <div>
                                <p className="text-white font-medium">Click to upload or drag and drop</p>
                                <p className="text-sm text-warm-gray">CSV files only</p>
                            </div>
                        </div>
                    </div>

                    {isProcessing && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-warm-gray">
                                <span>Processing...</span>
                                <span>{progress.current} / {progress.total}</span>
                            </div>
                            <div className="w-full bg-obsidian rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-gold h-full transition-all duration-300"
                                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
