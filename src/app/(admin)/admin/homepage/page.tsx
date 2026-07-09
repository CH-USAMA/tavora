import { db } from "@/shared/lib/db";
import { homepageSections } from "@/shared/lib/db/schema";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { DeleteHomepageSectionButton } from "@/features/homepage/components/DeleteHomepageSectionButton";
import { desc } from "drizzle-orm";
import { sectionTypeLabels } from "@/features/homepage/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";

export const dynamic = "force-dynamic";

export default async function AdminHomepagePage() {
    const allSections = await db.query.homepageSections.findMany({
        orderBy: [desc(homepageSections.sortOrder), desc(homepageSections.createdAt)],
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white font-serif">Homepage Configuration</h2>
                    <p className="text-sm text-warm-gray mt-1">Manage homepage content sections. Not yet wired to the live homepage.</p>
                </div>
                <Button asChild className="bg-gold text-black hover:bg-gold-light w-full sm:w-auto">
                    <Link href="/admin/homepage/new">
                        <Plus className="mr-2 h-4 w-4" /> Add Section
                    </Link>
                </Button>
            </div>

            <div className="bg-gunmetal rounded-md border border-warm-gray/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-warm-gray/10 hover:bg-transparent">
                                <TableHead className="text-warm-gray">Type</TableHead>
                                <TableHead className="text-warm-gray">Title</TableHead>
                                <TableHead className="text-warm-gray text-right">Order</TableHead>
                                <TableHead className="text-warm-gray text-right">Status</TableHead>
                                <TableHead className="text-warm-gray text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allSections.length === 0 ? (
                                <TableRow className="border-warm-gray/10 hover:bg-white/5">
                                    <TableCell colSpan={5} className="h-24 text-center text-warm-gray">
                                        No sections found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                allSections.map((section) => (
                                    <TableRow key={section.id} className="border-warm-gray/10 hover:bg-white/5">
                                        <TableCell className="text-white font-medium">
                                            {sectionTypeLabels[section.type as keyof typeof sectionTypeLabels] || section.type}
                                        </TableCell>
                                        <TableCell className="text-warm-gray">{section.title || "—"}</TableCell>
                                        <TableCell className="text-warm-gray text-right">{section.sortOrder}</TableCell>
                                        <TableCell className="text-right">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${section.isVisible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {section.isVisible ? 'Visible' : 'Hidden'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button asChild variant="ghost" size="sm" className="text-warm-gray hover:text-gold hover:bg-transparent">
                                                    <Link href={`/admin/homepage/${section.id}/edit`}>Edit</Link>
                                                </Button>
                                                <DeleteHomepageSectionButton id={section.id} label={section.title || section.type} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
