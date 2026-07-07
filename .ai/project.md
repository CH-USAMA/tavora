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

**Core Features (Initial):**
- Product catalog redirecting to Markaz for checkout
- Admin dashboard for complete content management
- Configurable homepage sections
- Image optimization & zoom
- SEO & Analytics integration

**Future Roadmap (Reserved in Architecture):**
- Full checkout, Stripe/JazzCash/EasyPaisa
- Reviews, Wishlists, Customer Accounts
- Multi-currency, Multi-language
