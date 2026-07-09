# Database Schema

Provider: **Turso (LibSQL)**. ORM: **Drizzle**. Source of truth for table shapes is
`src/shared/lib/db/schema.ts` — this doc is a human-readable summary of it, kept in sync
manually. If it looks stale, trust the schema file (and the live DB — see the gotcha below).

> ⚠️ **Before writing a migration, read `.ai/decisions.md` §8.** The local migration
> journal (`drizzle/`) has drifted from the live database before — columns exist live that
> no migration file created. Verify the live schema directly with `PRAGMA table_info(...)`
> via `@libsql/client` before assuming `drizzle-kit generate`'s diff is correct.

## Auth tables (Better Auth — don't hand-edit; managed by the `better-auth` library)
- `user` — includes a `role` column ("admin" required for admin panel access, enforced in `src/middleware.ts` and `requireAdmin()`)
- `session`, `account`, `verification` — standard Better Auth tables

## Catalog
- **`categories`** — name, slug (unique), description, image, sortOrder, isVisible
- **`collections`** — same shape as categories, independent grouping (a product can have both a category and a collection)
- **`products`** — title, slug (unique), description (rich text HTML, sanitized with `sanitize-html` at render time — see product page), brand, sku (unique), price, salePrice, categoryId (FK), collectionId (FK), isFeatured/isBestSeller/isNewArrival/isVisible/**inStock** (all booleans), externalUrl (Markaz link), imageUrl (primary image, denormalized), seoTitle/seoDescription
  - `specifications` and `tags` columns exist (JSON mode) but are not currently written to by any form — reserved for future use
- **`product_images`** — productId (FK, cascade delete), url, alt, sortOrder, isPrimary — full gallery; `products.imageUrl` is a denormalized copy of the primary image for cheap list-page queries

## Orders (added for the WhatsApp checkout flow — see `.ai/decisions.md` §7)
- **`orders`** — orderNumber (unique, format `TAV-<timestamp>`), customerName, customerPhone, customerAddress, notes, subtotal, status (`pending` | `confirmed` | `shipped` | `delivered` | `cancelled`, default `pending`)
- **`order_items`** — orderId (FK, cascade delete), productId (FK, nullable — kept even if the product is later deleted), productTitle/productImage/unitPrice (snapshotted at order time so historical orders don't change if the product is edited later), quantity, lineTotal

## Content management
- **`homepage_sections`** — type (`hero`/`about`/`text_banner`/`featured_products`/`custom`), title, subtitle, config (JSON: image/buttonText/buttonLink), sortOrder, isVisible. **Admin-only right now** — CRUD works but the live homepage doesn't read from this table yet (still hardcoded components). See `.ai/project.md` roadmap.
- **`testimonials`** — name, role, content, avatar, rating (1–5), isVisible, sortOrder. Admin-curated only; no public submission form.
- **`settings`** — generic key/value store (value is JSON). Currently only one row is used, `key = "site"`, holding `{ siteName, siteEmail, sitePhone, whatsappNumber, whatsappMessage, address, facebookUrl, instagramUrl, tiktokUrl }`. Read via `SettingsService.getSiteSettings()`, which returns sane defaults if the row doesn't exist yet.

## Unused
- **`audit_logs`** — table exists (adminId, action, entity, entityId, details, createdAt) but nothing currently writes to it. Reserved for a future admin activity log.

## Foreign keys
Turso enforces `PRAGMA foreign_keys = 1` by default. Any nullable FK column
(`categoryId`, `collectionId`, `productId` on order_items) must receive `null`/`undefined`,
never `""` — an empty string doesn't match any row and throws `FOREIGN KEY constraint
failed` at insert time. See the sanitization pattern in `src/features/products/repository.ts`.
