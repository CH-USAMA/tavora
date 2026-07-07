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

## 6. Dropshipping Flow
- **Decision:** No local checkout. Product "Buy" button redirects to Markaz URL.
- **Reason:** Current business model. Architecture must still support local cart/checkout in the future.
