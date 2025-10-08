# Copilot Instructions for AimHigh AI Career Coach

## Project Overview
This is a Next.js application structured for modular AI-powered career coaching. The codebase is organized by feature domains (resume, interview, dashboard, onboarding, cover letter) under `app/(main)/` and authentication flows under `app/(auth)/`. Shared UI components are in `components/ui/`.

## Architecture & Data Flow
- **Feature Modules:** Each main feature (e.g., interview, resume) has its own folder with subcomponents and pages. Example: `app/(main)/interview/` contains layouts, pages, and `_components/` for charts, quizzes, and stats.
- **Actions:** Business logic and API calls are separated into `actions/` (e.g., `actions/interview.js`). These are invoked from pages/components.
- **Lib:** Utility functions, schema definitions, and Prisma client setup are in `lib/`. Use `lib/prisma.js` for DB access and `lib/schema.js` for validation.
- **Data:** Static data (FAQs, features, testimonials) is in `data/`.
- **API Routes:** Custom API logic is in `app/api/` (e.g., `app/api/inngest/route.js`).

## Developer Workflows
- **Start Dev Server:** `npm run dev` (Next.js)
- **Build:** `npm run build`
- **Lint:** `npm run lint` (uses ESLint config in `eslint.config.mjs`)
- **No explicit test setup detected.**
- **Prisma:** DB schema in `prisma/schema.prisma`, migrations in `prisma/migrations/`. Use `npx prisma migrate dev` to apply changes.

## Conventions & Patterns
- **Component Structure:** Use functional React components. UI elements are in `components/ui/` and feature-specific components in `app/(main)/[feature]/_components/`.
- **Routing:** Next.js file-based routing. Dynamic routes use `[id]` folders.
- **State & Data Fetching:** Use hooks in `hooks/` (e.g., `use-fetch.js`).
- **Styling:** Global styles in `app/globals.css`. Use Tailwind/PostCSS (see `postcss.config.mjs`).
- **Auth:** Auth flows are under `app/(auth)/` with separate sign-in and sign-up pages.

## Integration Points
- **Prisma:** For database access, use the client in `lib/prisma.js` and schema in `prisma/schema.prisma`.
- **Inngest:** Event-driven logic in `lib/inngest/` and API route in `app/api/inngest/route.js`.
- **Static Assets:** Images and banners in `public/`.

## Examples
- To add a new interview feature, create a folder in `app/(main)/interview/`, add components to `_components/`, and business logic to `actions/interview.js`.
- For a new API route, add a file under `app/api/`.

## Key Files & Directories
- `app/(main)/`: Main feature modules
- `app/(auth)/`: Auth flows
- `actions/`: Business logic
- `lib/`: Utilities, DB, schema
- `prisma/`: DB schema & migrations
- `components/ui/`: Shared UI elements
- `data/`: Static data
- `public/`: Static assets

---
**Update this file as project conventions evolve.**
