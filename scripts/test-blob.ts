import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { put } from "@vercel/blob";

async function testBlob() {
    console.log("Testing Vercel Blob upload...");
    console.log("Token starts with:", process.env.BLOB_READ_WRITE_TOKEN?.substring(0, 20) + "...");

    try {
        const blob = await put("test-upload.txt", "Hello from Tavora test!", {
            access: "public",
        });
        console.log("✅ Blob upload successful!");
        console.log("URL:", blob.url);
    } catch (error) {
        console.error("❌ Blob upload failed:");
        console.error(error);
    }
}

testBlob();
