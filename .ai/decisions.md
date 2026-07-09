# Architectural Decisions Log

## 1. Project Initialization (2026-07)
- **Decision:** Use Next.js 15 App Router + React 19 + pnpm.
- **Reason:** Best performance, RSC support out of the box, fast package management.

## 2. Directory Structure
- **Decision:** Feature-First (`src/features/`) over Type-First (`src/components/`, `src/hooks/`).
- **Reason:** Better scalability for a large ecommerce platform. Related code lives together.

## 3. Database Abstraction
- **Decision:** Implement Repository and Service layers between Actions and Drizzle.
- **Reason:** Separates business logic from database operations, making future migrations (e.g., Turso to PostgreSQL) and unit testing significantly easier.

## 4. UI Library
- **Decision:** shadcn/ui over component libraries like MUI or Chakra.
- **Reason:** Gives full control over the markup and styling to implement a bespoke luxury design. No overhead of unused components.

## 5. Auth Strategy
- **Decision:** Better Auth (Email/Password initially).
- **Reason:** Native Next.js 15 support, easily extensible to social logins later, lightweight.

## 6. Dropshipping Flow (superseded by #7)
- **Decision:** No local checkout. Product "Buy" button redirects to Markaz URL.
- **Reason:** Current business model. Architecture must still support local cart/checkout in the future.
- **Status:** Superseded — see #7. The direct Markaz `externalUrl` link still exists on the
  product page as a secondary option, but it's no longer the primary buying flow.

## 7. Cart + WhatsApp Checkout, Payment Deferred (2026-07)
- **Decision:** Build a real cart (localStorage, quantities) and a checkout form (name/phone/
  address/notes) that creates an `orders`/`order_items` record and then hands off to WhatsApp
  with a consolidated order summary, instead of the old per-product "Buy via WhatsApp" button.
  No payment gateway yet — orders land as `pending` and are confirmed manually over WhatsApp.
- **Reason:** User wants to operate entirely through WhatsApp for now and add payment
  (Stripe/JazzCash/EasyPaisa) later. Building the order data model now means payment can be
  layered on top later without a rework — just add a `paymentStatus`/`paymentMethod` field
  and a payment step before order creation.
- **Stock model:** Simple boolean `inStock` toggle per product, not quantity tracking —
  appropriate for a dropshipping catalog with no physical inventory to count.
- **WhatsApp handoff UX:** Deliberately does NOT auto-open `window.open()` after the async
  `createOrderAction` call — async operations before `window.open` can cause popup blockers
  to silently swallow the tab in some browsers. Instead shows a "Continue to WhatsApp" link
  the customer clicks themselves (a fresh user gesture, never blocked).

## 8. Lessons Learned From Production Incidents (2026-07)
Real bugs hit in production this session, kept here so future work doesn't repeat them.

- **Drizzle's local migration history can silently drift from the live database.** Only one
  migration file (`drizzle/0000_...sql`) exists, but the live Turso DB has columns
  (`products.imageUrl`, `session.token`) that migration never created — they were added via
  `drizzle-kit push` at some point without a corresponding migration file being committed.
  Running `drizzle-kit generate` today produces a diff mixing real gaps with phantom ones.
  **Rule: before trusting `drizzle-kit generate`'s output, verify the live schema directly**
  (`PRAGMA table_info(<table>)` via `@libsql/client`, run with `npx tsx --env-file=.env.local`)
  rather than assuming the migration folder is authoritative.
- **Turso enforces `PRAGMA foreign_keys = 1` by default** (unlike vanilla SQLite, which
  defaults it off). An empty string `""` in a foreign-key column (e.g. a `<select>` with
  `value=""` for "None") throws `FOREIGN KEY constraint failed`, not a silent no-op. Any
  optional FK-like form field must convert `""` to `null`/`undefined` before hitting the
  repository — see `salePrice`/`sku`/`externalUrl`/`categoryId`/`collectionId` sanitization
  in `src/features/products/repository.ts` for the pattern.
- **jsdom-based packages break on Vercel's Turbopack serverless bundler**, even when they
  build fine locally and pass `next build`. `isomorphic-dompurify` crashed every
  `/product/[slug]` request in production with `ERR_REQUIRE_ESM` from a jsdom transitive
  dependency, despite a clean local `next build && next start`. Prefer parser-based
  sanitizers (`sanitize-html`, built on `htmlparser2`) over DOM-emulation-based ones.
- **Any page that renders `<Footer>` (which reads live Settings server-side) or otherwise
  depends on live DB state needs `export const dynamic = "force-dynamic"`.** Without it,
  Next.js may statically prerender the page at build time and bake in stale data — this hit
  both the homepage (deleted/new products not reflecting) and `/cart` (stale site settings)
  before being caught.
- **General debugging approach that worked:** pull real Vercel runtime logs with
  `npx vercel logs <deployment-url> --json` (the non-JSON view truncates error messages),
  and reproduce failing writes/reads locally against the live DB with a disposable script in
  `scripts/tmp-*.ts` (always insert-then-delete or read-only) before shipping a fix — this
  caught the FK constraint bug and confirmed the sanitize-html fix before it ever redeployed.
