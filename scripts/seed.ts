import { auth } from "../src/shared/lib/auth";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function seed() {
    console.log("🌱 Seeding database...");

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        console.error("❌ ADMIN_EMAIL or ADMIN_PASSWORD is not set in .env.local");
        process.exit(1);
    }

    try {
        // We use the admin plugin's API to create an admin user
        const newAdmin = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name: "Admin User",
                role: "admin", // Assumes RBAC plugin setup for admin
            }
        });

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
