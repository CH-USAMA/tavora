# Tavora - Premium Luxury Watch Platform

Tavora is a high-end luxury watch ecommerce platform. Customers browse the catalog, add
items to a cart, and check out by submitting their contact details — this creates an
order and hands off to WhatsApp for the team to confirm and fulfill manually. No payment
gateway yet; that's layered onto the existing order model in a later phase. See
`.ai/project.md` for the full feature list and roadmap.

**Important — this project uses pnpm, not npm.** The lockfile is `pnpm-lock.yaml`; running
`npm install` will corrupt the dependency tree (mixed npm/pnpm `node_modules` state has
caused real problems before). Always use `pnpm`.

## Quick Start

1.  **Install dependencies:**
    ```bash
    pnpm install
    ```
2.  **Environment Variables:**
    Copy `.env.example` to `.env.local` and fill in the values.
3.  **Database (Turso):**
    Ensure Turso CLI is installed and authenticated. Create a database and generate a token, then add them to `.env.local`.
    ```bash
    pnpm db:generate
    pnpm db:push
    pnpm db:seed
    ```
    **Caveat:** the local migration history has drifted from the live database before
    (columns added via `db:push` without a matching migration file ever being committed).
    Don't blindly trust `drizzle-kit generate`'s diff — verify the live schema directly
    first. See `.ai/decisions.md` (§8) for the exact method.
4.  **Run Development Server:**
    ```bash
    pnpm dev
    ```

## Admin Panel

Log in at `/admin/login` (Better Auth, email/password, `role: "admin"` required — see
`src/shared/lib/auth/index.ts`). Sections: Dashboard, Orders, Products (+ CSV bulk
import), Categories, Collections, Homepage Config (admin-only — not yet wired into the
live homepage), Testimonials, Media Library, Settings (site name, WhatsApp number/
message, socials — drives the storefront's WhatsApp links and Footer).

## Storefront Buying Flow

Home/Shop/Category pages → Add to Cart (localStorage cart, `src/features/cart/`) →
`/cart` review → `/checkout` (captures name/phone/address/notes, creates an
`orders`/`order_items` record) → WhatsApp handoff with the order summary pre-filled.
Products also carry an optional Markaz `externalUrl` as a secondary "Purchase via
Official Retailer" link.

## Architecture
See `.ai/architecture.md` and `.ai/project.md` for deep dives into the architectural patterns (Feature-First, Repository/Service Layers, and where those layers are pragmatically skipped).

## Design System
See `.ai/design-system.md` for colors, typography, and styling guidelines.

## Documentation Links
- [Database Schema](./Database.md)
- [Folder Structure](./FolderStructure.md)
- [Architectural Decisions & Lessons Learned](../.ai/decisions.md) — read §8 before touching schema, sanitization, or DB-reading pages; it documents real production incidents.
