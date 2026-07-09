# Folder Structure

This reflects the actual repo layout (not the original aspirational plan in
`implementation_plan.md`, which sketched a few features — newsletter, search, wishlist,
analytics — that were never built; ignore those parts of that doc).

```
src/
├── app/                                  # Next.js App Router — routing + page-level data fetching only
│   ├── (admin)/admin/                    # Admin panel (route group, all behind middleware auth)
│   │   ├── layout.tsx                    # Sidebar nav, mobile-responsive off-canvas drawer
│   │   ├── page.tsx                      # Dashboard: stats, recent products, setup checklist
│   │   ├── orders/[[id]/]                # List + detail, inline status selector
│   │   ├── products/[new|[id]/edit|bulk]
│   │   ├── categories/, collections/, testimonials/, homepage/   # list/new/[id]/edit each
│   │   ├── media/                        # Vercel Blob browser (list/upload/delete)
│   │   └── settings/                     # Site name, WhatsApp, socials
│   ├── (auth)/admin/login/               # Admin login page (outside the auth-gated group)
│   ├── api/
│   │   ├── auth/[...all]/                # Better Auth catch-all handler
│   │   └── upload/                       # Vercel Blob upload token endpoint (auth-checked)
│   ├── cart/, checkout/                  # Storefront cart review + WhatsApp checkout
│   ├── shop/, category/[slug]/, product/[slug]/
│   ├── layout.tsx                        # Root layout: fonts, CartProvider, WhatsAppButton, Toaster
│   ├── page.tsx                          # Homepage (force-dynamic — reads live product data)
│   ├── sitemap.ts, robots.ts
│   └── middleware.ts                     # Redirects unauthenticated /admin/* to /admin/login
│
├── features/                             # Feature-first modules — see .ai/architecture.md
│   ├── products/     categories/         # Full Action → Service → Repository layering
│   ├── collections/  testimonials/       # Simpler features: actions.ts talks to Drizzle directly
│   │   homepage/     settings/           # (no service.ts/repository.ts — see architecture.md
│   │   media/        orders/             #  for why that's intentional, not incomplete)
│   ├── cart/                             # CartContext (localStorage), AddToCartButton,
│   │                                     #   ProductBuyBox (quantity selector), Cart/Checkout page content
│   └── storefront/                       # Navbar, Footer, HeroSection, FeaturedProducts, ProductSlider, AboutSection
│       └── each feature/* generally has: actions.ts, types.ts (Zod), components/
│
├── shared/
│   ├── components/ui/                    # shadcn/ui primitives (Button, Input, Table, Checkbox, ...)
│   ├── components/Pagination.tsx         # Reused by Shop page + admin Products list
│   └── lib/
│       ├── db/                           # schema.ts (source of truth), index.ts (Drizzle client)
│       └── auth/                         # index.ts (Better Auth config), client.ts, require-admin.ts
│
drizzle/                                  # Migration files (see the drift warning in docs/Database.md)
scripts/                                  # seed.ts, test-blob.ts — permanent scripts.
                                           #   Temporary one-off verification scripts (tmp-*.ts) are
                                           #   created and deleted within a session; never commit them.
public/                                   # Static assets
```

## Conventions worth knowing
- **Route-group parentheses** (`(admin)`, `(auth)`) don't affect the URL — they're purely for organizing layouts.
- **Server Components by default.** `"use client"` only appears on leaf components that need state/effects/handlers (forms, the cart, interactive admin widgets).
- **Any page reading live DB state (directly, or indirectly via `<Footer>`/`<WhatsAppButton>` which read Settings) needs `export const dynamic = "force-dynamic"`** — otherwise Next may statically prerender it at build time and serve stale data forever. This has broken the homepage and `/cart` before; see `.ai/decisions.md` §8.
- **Admin server actions start with `await requireAdmin();`** as their first line (except public storefront actions like `createOrderAction` — those intentionally have no auth check).
