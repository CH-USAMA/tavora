# Tavora - Premium Luxury Watch Platform

Tavora is a high-end luxury watch ecommerce platform. It is currently configured for dropshipping (redirecting to Markaz for checkout) but is architected to scale into a full ecommerce platform.

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
4.  **Run Development Server:**
    ```bash
    pnpm dev
    ```

## Architecture
See `.ai/architecture.md` and `.ai/project.md` for deep dives into the architectural patterns (Feature-First, Repository/Service Layers).

## Design System
See `.ai/design-system.md` for colors, typography, and styling guidelines.

## Documentation Links
- [Database Schema](./Database.md)
- [API Routes](./API.md)
- [Folder Structure](./FolderStructure.md)
