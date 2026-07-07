# Tavora — Luxury Watch Platform Implementation Plan (v2)

## Changes from v1

- ✅ Added `.ai/` memory folder for cross-session AI consistency
- ✅ Switched to **Feature-First** architecture
- ✅ Added **Repository + Service** layers (Action → Service → Repository → Drizzle)
- ✅ Centralized **Design Tokens** config
- ✅ Configurable, reorderable homepage sections (admin-driven)
- ✅ Image optimization pipeline (WebP/AVIF, thumbnails, retina, zoom)
- ✅ Analytics from day one (GA4, Vercel Analytics, Clarity)
- ✅ Future-proof architecture reservations
- ✅ Brand name confirmed: **Tavora**
- ✅ Auth: email/password only for now

---

## Revised Architecture

```
d:\AI Projects\Tavora\
├── .ai/                          # AI Memory (cross-session context)
│   ├── project.md
│   ├── architecture.md
│   ├── design-system.md
│   ├── decisions.md
│   ├── roadmap.md
│   ├── coding-standards.md
│   ├── ui-rules.md
│   ├── prompts.md
│   └── changelog.md
│
├── docs/                         # Human documentation
│   ├── README.md
│   ├── Database.md
│   ├── API.md
│   ├── Components.md
│   ├── Deployment.md
│   ├── Environment.md
│   └── FolderStructure.md
│
├── src/
│   ├── app/
│   │   ├── (storefront)/        # Public routes
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── shop/
│   │   │   ├── collections/
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   └── [policy]/
│   │   ├── (admin)/             # Admin routes
│   │   │   └── admin/
│   │   │       ├── layout.tsx
│   │   │       ├── page.tsx     # Dashboard
│   │   │       ├── products/
│   │   │       ├── categories/
│   │   │       ├── collections/
│   │   │       ├── homepage/
│   │   │       ├── testimonials/
│   │   │       ├── media/
│   │   │       └── settings/
│   │   ├── api/                 # API routes (auth, webhooks)
│   │   ├── layout.tsx           # Root layout
│   │   ├── globals.css
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   │
│   ├── features/                # Feature-first modules
│   │   ├── products/
│   │   │   ├── components/      # ProductCard, ProductGrid, etc.
│   │   │   ├── actions/         # Server Actions
│   │   │   ├── services/        # Business logic
│   │   │   ├── repositories/    # Database queries
│   │   │   ├── hooks/           # Client hooks
│   │   │   ├── validators/      # Zod schemas
│   │   │   ├── types/           # Feature-specific types
│   │   │   └── queries/         # React Query / cached fetches
│   │   ├── categories/
│   │   ├── collections/
│   │   ├── homepage/
│   │   ├── testimonials/
│   │   ├── newsletter/
│   │   ├── search/
│   │   ├── wishlist/
│   │   ├── media/
│   │   ├── analytics/
│   │   ├── auth/
│   │   └── settings/
│   │
│   ├── shared/                  # Shared across features
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui primitives
│   │   │   ├── layout/          # Navbar, Footer, Sidebar
│   │   │   └── sections/        # Reusable page sections
│   │   ├── lib/                 # Utilities, constants
│   │   │   ├── db/              # Drizzle client + schema
│   │   │   ├── auth/            # Better Auth config
│   │   │   ├── seo/             # Metadata + structured data
│   │   │   ├── analytics/       # Analytics helpers
│   │   │   └── utils/           # General utilities
│   │   ├── hooks/               # Global hooks
│   │   ├── types/               # Global types
│   │   └── config/              # Site config, design tokens, nav
│   │
│   └── middleware.ts
│
├── drizzle/                     # Migration files
├── scripts/                     # Seed, setup scripts
├── public/                      # Static assets
├── drizzle.config.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.local
├── .env.example
└── package.json
```

### Data Flow Pattern

```
Client Request
  ↓
Server Action (validation + auth check)
  ↓
Service Layer (business logic, transformations)
  ↓
Repository Layer (database queries via Drizzle)
  ↓
Drizzle ORM
  ↓
Turso (LibSQL)
```

---

## Milestones (unchanged scope, updated architecture)

| # | Milestone | Status |
|---|-----------|--------|
| 1 | Foundation & Design System | 🔜 Next |
| 2 | Database & ORM | ⏳ |
| 3 | Authentication | ⏳ |
| 4 | Admin Dashboard | ⏳ |
| 5 | Storefront Pages | ⏳ |
| 6 | Product Detail Page | ⏳ |
| 7 | SEO & Performance | ⏳ |
| 8 | Polish & Launch | ⏳ |

---

## Milestone 1 Scope

1. Scaffold Next.js 15 project with pnpm
2. Install + configure TailwindCSS, shadcn/ui
3. Create `.ai/` memory folder with initial context
4. Create `docs/` structure
5. Design tokens configuration
6. Root layout with fonts (Playfair Display + Inter)
7. Site config (brand, nav, social)
8. Navbar component (sticky, transparent-to-solid)
9. Footer component
10. Landing page shell (placeholder sections)
11. Install Turso CLI + Vercel CLI
12. `.env.example` with all required variables

