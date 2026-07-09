# Tavora — Luxury Watch Platform

A luxury watch storefront with a cart + WhatsApp checkout flow (no payment gateway yet —
that's a deferred, later phase) and a full admin panel for managing products, categories,
collections, testimonials, homepage content, media, orders, and site settings.

**Live:** https://tavora-hazel.vercel.app

**Full documentation:** see [`docs/README.md`](./docs/README.md) — quick start, admin
panel guide, buying flow, and links to the database schema and folder structure docs.
Architectural decisions and hard-won production lessons live in [`.ai/decisions.md`](./.ai/decisions.md).

## Quick Start

```bash
pnpm install        # this project uses pnpm — npm install will corrupt node_modules
cp .env.example .env.local   # fill in Turso, Better Auth, and Vercel Blob credentials
pnpm dev
```

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · shadcn/ui · Turso (LibSQL) +
Drizzle ORM · Better Auth · Vercel Blob
