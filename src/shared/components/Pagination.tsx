import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    buildHref: (page: number) => string;
    className?: string;
}

export function Pagination({ currentPage, totalPages, buildHref, className }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
        (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
    );

    return (
        <nav className={`flex items-center justify-center gap-2 ${className || ""}`} aria-label="Pagination">
            <Link
                href={buildHref(Math.max(1, currentPage - 1))}
                aria-disabled={currentPage === 1}
                className={`flex items-center justify-center h-9 w-9 border border-warm-gray/20 text-warm-gray hover:text-gold hover:border-gold/40 transition-colors ${currentPage === 1 ? "pointer-events-none opacity-30" : ""}`}
            >
                <ChevronLeft className="h-4 w-4" />
            </Link>

            {pages.map((page, idx) => {
                const prevPage = pages[idx - 1];
                const showEllipsis = prevPage !== undefined && page - prevPage > 1;
                return (
                    <span key={page} className="flex items-center gap-2">
                        {showEllipsis && <span className="text-warm-gray/40 text-sm px-1">…</span>}
                        <Link
                            href={buildHref(page)}
                            className={`flex items-center justify-center h-9 w-9 text-sm border transition-colors ${
                                page === currentPage
                                    ? "border-gold text-gold bg-gold/10"
                                    : "border-warm-gray/20 text-warm-gray hover:text-gold hover:border-gold/40"
                            }`}
                        >
                            {page}
                        </Link>
                    </span>
                );
            })}

            <Link
                href={buildHref(Math.min(totalPages, currentPage + 1))}
                aria-disabled={currentPage === totalPages}
                className={`flex items-center justify-center h-9 w-9 border border-warm-gray/20 text-warm-gray hover:text-gold hover:border-gold/40 transition-colors ${currentPage === totalPages ? "pointer-events-none opacity-30" : ""}`}
            >
                <ChevronRight className="h-4 w-4" />
            </Link>
        </nav>
    );
}
