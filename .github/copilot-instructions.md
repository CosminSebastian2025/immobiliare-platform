# Copilot instructions for immobiliere-platform

## Project overview
This repository is a real-estate platform built with Next.js 16 (App Router), Prisma + PostgreSQL, and NextAuth. The app is organized around a public-facing property portal, authenticated dashboard flows, and admin-only routes.

## Build, lint, and validation commands
Use the repo scripts from the project root:

- Install dependencies: `npm install`
- Start the local Postgres database used by the app: `docker compose up -d db`
- Generate the Prisma client after schema changes: `npx prisma generate`
- Run the app locally: `npm run dev`
- Run ESLint: `npm run lint`
- Create a production build: `npm run build`
- Start the production build: `npm run start`

There is no `npm test` script and no dedicated test runner configured in this repo today. For validation, rely on `npm run lint` and `npm run build` unless a new test tool is introduced.

If you modify `prisma/schema.prisma`, keep the Prisma schema and generated client in sync; do not leave the schema and runtime code out of step.

## High-level architecture
- `src/app`: App Router entry points. The route groups show the major app domains:
  - `src/app/(pubblic)`: public listing pages, search, and detail views
  - `src/app/(auth)`: login/register/reset flows
  - `src/app/(dashboard)`: authenticated management screens
  - `src/app/(admin)`: admin-only screens
  - `src/app/api`: route handlers for register, auth, Stripe checkout, and webhooks
- `src/lib/auth.ts`: NextAuth setup with `CredentialsProvider` + Google OAuth and JWT session handling.
- `src/middleware.ts`: protects dashboard/admin/settings routes and redirects unauthenticated users to `/login`.
- `src/components`: UI building blocks. The listing creation flow is built as a multi-step wizard (`src/components/listings/listing-form-wizard.tsx` and the step components under `src/components/listings/steps/`).
- `prisma/schema.prisma`: the source of truth for the data model. The schema includes the auth tables (`User`, `Account`, `Session`, `VerificationToken`) and the real-estate domain (`Listing`, `Address`, `Photo`, `Inquiry`, etc.).
- `src/lib/prisma.ts`: singleton Prisma client for app code.
- `docker-compose.yaml`: local PostgreSQL + Adminer setup for development.

## Key conventions in this repo
- The business language is largely Italian and the domain vocabulary reflects the Italian real-estate workflow (`Annunci`, `Vendita`, `Affitto`, `Agenzia`, etc.). Match the existing user-facing terminology unless a new feature clearly requires different wording.
- Prisma is the canonical DB layer. Prefer Prisma queries and schema changes over custom SQL; if the schema changes, regenerate the client and keep migrations consistent with the project workflow.
- Auth flow and request validation are handled in the API layer with `zod` before writes to Prisma. The register route is a good example of the expected pattern.
- The primary feature flow is a multi-step listing creation wizard; when editing listing-related code, keep the state model and the Prisma `Listing` schema aligned.
- The app expects a PostgreSQL `DATABASE_URL` in local development and CI; do not assume SQLite or a mock database.
