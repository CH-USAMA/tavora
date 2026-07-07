import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// --- Auth Tables (Better Auth) ---
export const user = sqliteTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: integer("emailVerified", { mode: "boolean" }).notNull(),
    image: text("image"),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
    role: text("role"), // For admin role
    banned: integer("banned", { mode: "boolean" }),
    banReason: text("banReason"),
    banExpires: integer("banExpires", { mode: "timestamp" }),
});

export const session = sqliteTable("session", {
    id: text("id").primaryKey(),
    expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId").notNull().references(() => user.id),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
    impersonatedBy: text("impersonatedBy"),
});

export const account = sqliteTable("account", {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId").notNull().references(() => user.id),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    expiresAt: integer("expiresAt", { mode: "timestamp" }),
    password: text("password"),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

// --- Storefront Tables ---

export const categories = sqliteTable("categories", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    image: text("image"),
    sortOrder: integer("sortOrder").default(0),
    isVisible: integer("isVisible", { mode: "boolean" }).default(true),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const collections = sqliteTable("collections", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    image: text("image"),
    sortOrder: integer("sortOrder").default(0),
    isVisible: integer("isVisible", { mode: "boolean" }).default(true),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const products = sqliteTable("products", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    specifications: text("specifications", { mode: "json" }), // Store as JSON array of key-value
    brand: text("brand"),
    sku: text("sku").unique(),
    price: real("price").notNull(),
    salePrice: real("salePrice"),
    categoryId: text("categoryId").references(() => categories.id),
    collectionId: text("collectionId").references(() => collections.id),
    tags: text("tags", { mode: "json" }), // Store as JSON array of strings
    isFeatured: integer("isFeatured", { mode: "boolean" }).default(false),
    isBestSeller: integer("isBestSeller", { mode: "boolean" }).default(false),
    isNewArrival: integer("isNewArrival", { mode: "boolean" }).default(false),
    isVisible: integer("isVisible", { mode: "boolean" }).default(true),
    externalUrl: text("externalUrl"), // Markaz dropshipping URL
    seoTitle: text("seoTitle"),
    seoDescription: text("seoDescription"),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const productImages = sqliteTable("product_images", {
    id: text("id").primaryKey(),
    productId: text("productId").notNull().references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    alt: text("alt"),
    sortOrder: integer("sortOrder").default(0),
    isPrimary: integer("isPrimary", { mode: "boolean" }).default(false),
});

export const homepageSections = sqliteTable("homepage_sections", {
    id: text("id").primaryKey(),
    type: text("type").notNull(), // e.g., 'hero', 'featured_products', 'text_banner'
    title: text("title"),
    subtitle: text("subtitle"),
    config: text("config", { mode: "json" }), // JSON configuration specific to the section type
    sortOrder: integer("sortOrder").default(0),
    isVisible: integer("isVisible", { mode: "boolean" }).default(true),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const testimonials = sqliteTable("testimonials", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    role: text("role"),
    content: text("content").notNull(),
    avatar: text("avatar"),
    rating: integer("rating").default(5),
    isVisible: integer("isVisible", { mode: "boolean" }).default(true),
    sortOrder: integer("sortOrder").default(0),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const settings = sqliteTable("settings", {
    id: text("id").primaryKey(),
    key: text("key").notNull().unique(),
    value: text("value", { mode: "json" }),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const auditLogs = sqliteTable("audit_logs", {
    id: text("id").primaryKey(),
    adminId: text("adminId").notNull().references(() => user.id),
    action: text("action").notNull(),
    entity: text("entity"),
    entityId: text("entityId"),
    details: text("details", { mode: "json" }),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});
