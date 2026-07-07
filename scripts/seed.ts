import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { auth } from "../src/shared/lib/auth";

async function seed() {
    console.log("🌱 Seeding database...");

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        console.error("❌ ADMIN_EMAIL or ADMIN_PASSWORD is not set in .env.local");
        process.exit(1);
    }

    try {
        const newUser = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name: "Admin User",
            }
        });

        // Set role to admin directly in the database
        const { db } = await import("../src/shared/lib/db");
        const { user } = await import("../src/shared/lib/db/schema");
        const { eq } = await import("drizzle-orm");
        
        if (newUser && newUser.user) {
            await db.update(user)
              .set({ role: "admin" })
              .where(eq(user.id, newUser.user.id));
        }

        console.log(`✅ Admin user created successfully: ${email}`);
    } catch (error: any) {
        if (error.message?.includes("already exists") || error.code === 'USER_ALREADY_EXISTS') {
            console.log(`⚠️ Admin user ${email} already exists.`);
        } else {
            console.error("❌ Error creating admin user:", error);
            process.exit(1);
        }
    }

    console.log("🌱 Seeding complete.");
    process.exit(0);
}

seed();
