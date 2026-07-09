"use server";

import { db } from "@/shared/lib/db";
import { testimonials } from "@/shared/lib/db/schema";
import { eq } from "drizzle-orm";
import { createTestimonialSchema, CreateTestimonialInput } from "./types";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/shared/lib/auth/require-admin";

export async function createTestimonialAction(data: CreateTestimonialInput) {
    try {
        await requireAdmin();
        const validated = createTestimonialSchema.parse(data);
        const id = crypto.randomUUID();

        await db.insert(testimonials).values({
            id,
            ...validated,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        revalidatePath("/admin/testimonials");
        return { success: true, id };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateTestimonialAction(id: string, data: CreateTestimonialInput) {
    try {
        await requireAdmin();
        const validated = createTestimonialSchema.parse(data);

        await db.update(testimonials).set({
            ...validated,
            updatedAt: new Date()
        }).where(eq(testimonials.id, id));

        revalidatePath("/admin/testimonials");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteTestimonialAction(id: string) {
    try {
        await requireAdmin();
        await db.delete(testimonials).where(eq(testimonials.id, id));
        revalidatePath("/admin/testimonials");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
