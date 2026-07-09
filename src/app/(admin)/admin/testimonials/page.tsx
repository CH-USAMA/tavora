import { db } from "@/shared/lib/db";
import { testimonials } from "@/shared/lib/db/schema";
import { Plus, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { DeleteTestimonialButton } from "@/features/testimonials/components/DeleteTestimonialButton";
import { desc } from "drizzle-orm";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
    const allTestimonials = await db.query.testimonials.findMany({
        orderBy: [desc(testimonials.sortOrder), desc(testimonials.createdAt)],
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-white font-serif">Testimonials</h2>
                <Button asChild className="bg-gold text-black hover:bg-gold-light w-full sm:w-auto">
                    <Link href="/admin/testimonials/new">
                        <Plus className="mr-2 h-4 w-4" /> Add Testimonial
                    </Link>
                </Button>
            </div>

            <div className="bg-gunmetal rounded-md border border-warm-gray/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-warm-gray/10 hover:bg-transparent">
                                <TableHead className="text-warm-gray w-16">Avatar</TableHead>
                                <TableHead className="text-warm-gray">Name</TableHead>
                                <TableHead className="text-warm-gray">Content</TableHead>
                                <TableHead className="text-warm-gray text-right">Rating</TableHead>
                                <TableHead className="text-warm-gray text-right">Status</TableHead>
                                <TableHead className="text-warm-gray text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allTestimonials.length === 0 ? (
                                <TableRow className="border-warm-gray/10 hover:bg-white/5">
                                    <TableCell colSpan={6} className="h-24 text-center text-warm-gray">
                                        No testimonials found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                allTestimonials.map((testimonial) => (
                                    <TableRow key={testimonial.id} className="border-warm-gray/10 hover:bg-white/5">
                                        <TableCell>
                                            <div className="h-10 w-10 relative rounded-full overflow-hidden bg-charcoal border border-warm-gray/20">
                                                {testimonial.avatar && (
                                                    <Image src={testimonial.avatar} alt={testimonial.name} fill className="object-cover" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium text-white">
                                            {testimonial.name}
                                            {testimonial.role && <div className="text-xs text-warm-gray">{testimonial.role}</div>}
                                        </TableCell>
                                        <TableCell className="text-warm-gray text-sm max-w-xs truncate">{testimonial.content}</TableCell>
                                        <TableCell className="text-right">
                                            <span className="inline-flex items-center gap-1 text-gold text-sm">
                                                {testimonial.rating} <Star className="h-3 w-3 fill-gold" />
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${testimonial.isVisible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {testimonial.isVisible ? 'Visible' : 'Hidden'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button asChild variant="ghost" size="sm" className="text-warm-gray hover:text-gold hover:bg-transparent">
                                                    <Link href={`/admin/testimonials/${testimonial.id}/edit`}>Edit</Link>
                                                </Button>
                                                <DeleteTestimonialButton id={testimonial.id} name={testimonial.name} />
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
