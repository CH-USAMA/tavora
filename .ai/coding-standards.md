# Coding Standards

1.  **TypeScript:** Strict mode enabled. Define explicit types or interfaces for all data structures. Use Zod for runtime validation and infer types from schemas where applicable.
2.  **Server vs. Client Components:** Default to Server Components (`layout.tsx`, `page.tsx`). Add `"use client"` ONLY to the smallest leaf components that require interactivity (useState, useEffect, onClick).
3.  **Data Fetching:** Fetch data in Server Components and pass down as props. Use `Suspense` for loading states and streaming.
4.  **Mutations:** Use Next.js Server Actions. Pass `FormData` or validated objects.
5.  **Styling:** Use TailwindCSS utility classes. Combine with `clsx` and `tailwind-merge` (`cn` utility) for dynamic classes. Extract complex, repeated UI into shadcn/ui components.
6.  **Avoid Mock Data:** Build architecture assuming real database connectivity. Do not hardcode product data in components.
7.  **Comments:** Document "why", not "what". Code should be self-documenting through clear variable and function names.
8.  **Imports:** Use absolute imports (`@/features/...`, `@/shared/...`).
