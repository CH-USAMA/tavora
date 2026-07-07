import { db } from "@/shared/lib/db";
import { products, categories, collections } from "@/shared/lib/db/schema";
import { count } from "drizzle-orm";

export default async function AdminDashboardPage() {
    // Fetch basic stats
    const productCount = await db.select({ value: count() }).from(products);
    const categoryCount = await db.select({ value: count() }).from(categories);
    const collectionCount = await db.select({ value: count() }).from(collections);

    const stats = [
        { name: "Total Products", value: productCount[0].value },
        { name: "Active Categories", value: categoryCount[0].value },
        { name: "Active Collections", value: collectionCount[0].value },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((item) => (
                    <div
                        key={item.name}
                        className="p-6 bg-gunmetal rounded-lg shadow-md border border-warm-gray/10"
                    >
                        <h3 className="text-sm font-medium text-warm-gray">{item.name}</h3>
                        <p className="mt-2 text-3xl font-semibold text-white">{item.value}</p>
                    </div>
                ))}
            </div>

            <div className="p-6 bg-gunmetal rounded-lg shadow-md border border-warm-gray/10">
                <h3 className="text-lg font-medium text-white mb-4">Welcome to Tavora Admin</h3>
                <p className="text-warm-gray">
                    This is your central command center. Use the sidebar to navigate between your products,
                    categories, and site configuration. 
                </p>
                <div className="mt-6">
                    <p className="text-sm text-warm-gray mb-2">Getting started:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gold">
                        <li>Configure your Homepage layout</li>
                        <li>Add your first Collection</li>
                        <li>Add Products and link them to Markaz</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
