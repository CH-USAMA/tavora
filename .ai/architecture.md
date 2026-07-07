# Architecture Guidelines

## Overall Pattern
- **Feature-First:** Code is organized by domain in `src/features/` (e.g., `products`, `categories`).
- **Shared Code:** Reusable UI components, hooks, utilities go in `src/shared/`.
- **Data Flow:** Client Action -> Server Action -> Service Layer -> Repository Layer -> Database.

## Layer Definitions
1.  **Server Actions (`features/*/actions`):** Entry points for client mutations. Handle auth checks and Zod validation. Pass clean data to Services.
2.  **Services (`features/*/services`):** Business logic. Compute fields, coordinate multiple repositories, handle external API calls.
3.  **Repositories (`features/*/repositories`):** Database interaction layer. Contains Drizzle queries. No business logic here.
4.  **UI Components (`features/*/components` & `shared/components/ui`):** React Server Components (RSC) by default. Use `"use client"` only when interactivity (state, effects, event listeners) is required.

## Database
- **Provider:** Turso (LibSQL)
- **ORM:** Drizzle
- **Migrations:** Managed via `drizzle-kit`

## Storage
- **Media:** Vercel Blob for image uploads. Client uploads for large files (>4.5MB), server uploads for smaller assets.

## Authentication
- **Provider:** Better Auth
- **Setup:** Email/Password for admin access. Plugin: `admin`. Route protection via Next.js Middleware.
