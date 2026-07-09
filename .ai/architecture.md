# Architecture Guidelines

## Overall Pattern
- **Feature-First:** Code is organized by domain in `src/features/` (e.g., `products`, `categories`).
- **Shared Code:** Reusable UI components, hooks, utilities go in `src/shared/`.
- **Data Flow:** Client Action -> Server Action -> Service Layer -> Repository Layer -> Database.

## Layer Definitions
1.  **Server Actions (`features/*/actions.ts`):** Entry points for client mutations. Handle auth checks and Zod validation. Pass clean data to Services (or directly to Drizzle for simple features — see below).
2.  **Services (`features/*/service.ts`):** Business logic. Compute fields, coordinate multiple repositories, handle external API calls.
3.  **Repositories (`features/*/repository.ts`):** Database interaction layer. Contains Drizzle queries. No business logic here.
4.  **UI Components (`features/*/components` & `shared/components/ui`):** React Server Components (RSC) by default. Use `"use client"` only when interactivity (state, effects, event listeners) is required.

**Pragmatic exception:** the full Action → Service → Repository chain is used for
`products` and `categories` (the two most complex domains — image handling, slug
generation, cross-entity validation). Simpler single-table CRUD features
(`collections`, `testimonials`, `homepage`, `settings`, `orders`, `media`) skip the
Service/Repository layers and call Drizzle directly from `actions.ts` — there's no
business logic to separate out for a plain create/update/delete. Don't add empty
Service/Repository files to "match the pattern" for a feature that doesn't need them;
add the layer back if/when real logic accumulates.

## Authorization
Route-level protection is handled by `src/middleware.ts` (redirects unauthenticated
`/admin/*` requests to `/admin/login`). Additionally, every mutating Server Action in an
admin feature calls `await requireAdmin()` (from `src/shared/lib/auth/require-admin.ts`)
as its first line — this is defense-in-depth, since a Server Action's endpoint can in
principle be invoked directly once its reference is known, independent of which page
requested it. Public-facing actions callable from the storefront (e.g.
`createOrderAction`) intentionally have **no** `requireAdmin()` call — don't add one.

## Database
- **Provider:** Turso (LibSQL)
- **ORM:** Drizzle
- **Migrations:** Managed via `drizzle-kit`

## Storage
- **Media:** Vercel Blob for image uploads. Client uploads for large files (>4.5MB), server uploads for smaller assets.

## Authentication
- **Provider:** Better Auth
- **Setup:** Email/Password for admin access. Plugin: `admin`. Route protection via Next.js Middleware.
