# Tavora - Project Definition

**Project Name:** Tavora
**Type:** Luxury Watch Platform (Dropshipping initially, Full Ecommerce later)
**Primary Goal:** Build trust, increase conversion, showcase premium branding.
**Target Audience:** Luxury watch buyers looking for premium, trustworthy experiences.
**Aesthetics:** Matte Black, Pure White, Champagne Gold, Silver, Gunmetal. Cinematic, minimalist, generous whitespace, floating cards.

**Key Architecture Decisions:**
- Next.js 15 App Router
- React 19, TypeScript
- TailwindCSS v4, shadcn/ui
- Turso (LibSQL) + Drizzle ORM
- Better Auth (Email/Password)
- Vercel Blob for media
- Feature-First Folder Structure (`src/features/`)
- Repository + Service layer pattern

**Current Model: WhatsApp Commerce (no payment gateway yet)**
Customers browse the catalog, add items to a cart (localStorage, no login required), and
checkout by submitting name/phone/address — this creates an `orders` record and hands off
to WhatsApp with a pre-filled order summary for the team to confirm and fulfill manually.
Each product also keeps an optional Markaz `externalUrl` as a direct "Purchase via Official
Retailer" fallback. This is a deliberate phase: ship a working sales loop without payment
gateway integration, then bolt payment onto the existing order model later.

**Core Features (Shipped):**
- Full product catalog: categories, collections, sale pricing, badges (featured/best
  seller/new arrival), simple In Stock / Out of Stock toggle
- Cart + WhatsApp checkout (`/cart`, `/checkout`) backed by an `orders`/`order_items` data model
- Admin dashboard: live stats, recent products, dynamic setup checklist, quick actions
- Admin CRUD for Products (+ CSV bulk import), Categories, Collections, Testimonials,
  Homepage sections (content management only — not yet wired into the live homepage),
  Media Library (Vercel Blob), Orders (status pipeline: pending → confirmed → shipped →
  delivered → cancelled), and Settings (site name, WhatsApp number/message, socials)
- Auth-gated admin (Better Auth, middleware + per-action `requireAdmin()` checks)
- SEO basics: sitemap, robots, per-page metadata

**Future Roadmap:**
- Payment gateway (Stripe/JazzCash/EasyPaisa) layered onto the existing `orders` table
- Wire Homepage Config sections into the actual homepage render (currently admin-only)
- Reviews, Wishlists, Customer Accounts
- Multi-currency, Multi-language
- Automated Markaz/supplier sync (products are added manually or via CSV today)
