import { MediaLibrary } from "@/features/media/components/MediaLibrary";
import { listMediaAction } from "@/features/media/actions";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
    const result = await listMediaAction();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white font-serif">Media Library</h2>
                <p className="text-sm text-warm-gray mt-1">Manage all uploaded images.</p>
            </div>

            <MediaLibrary
                initialBlobs={result.blobs}
                initialCursor={result.cursor}
                initialHasMore={result.hasMore}
            />
        </div>
    );
}
