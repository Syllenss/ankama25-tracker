# AGENTS.md

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

- Respond in French by default, including explanations of technical concepts.
- Keep all project artifacts (code, identifiers, comments, documentation, commits, etc.) in English.

---

> **Precedence** — When this document conflicts with the existing code, **this document wins**: apply it and flag the divergence, instead of silently following the old pattern.

---

# 1. Project Overview

Site mono-page qui affiche la liste des récompenses possibles de la loterie des 25 ans d'Ankama. L'utilisateur peut cocher celles qu'il a déjà obtenues, et cette sélection est sauvegardée directement dans le navigateur (stockage local), sans backend ni compte utilisateur.

---

## 2. Target Audience

Joueurs et fans de l'univers Ankama (Dofus, Wakfu, etc.) participant à la loterie des 25 ans, qui veulent garder une trace personnelle des lots déjà obtenus au fil des drops, de façon simple et sans créer de compte.

---

# 2. Tech Stack

## Tooling

- **pnpm** — package manager; strict node_modules, no phantom dependencies, fast installs.

## TypeScript

- **Pino** — structured JSON logging, low overhead; `pino-pretty` for the console in dev.

## React

- **Tailwind CSS** — utility-first styling, no separate stylesheet to keep in sync.
- **shadcn/ui** (Base UI) — components copied into the repo and owned, not a black-box dependency.
- **Lucide React** — the project's only icon set; consistent stroke and sizing.
- **Framer Motion** — declarative animations, including enter/exit transitions.
- **nuqs** — URL as state, so views are shareable and survive a reload.
- **zustand** — client store for cross-cutting UI state; minimal API, no provider.

---

# 3. Project Structure

```
src/
├── app/                # Next.js routing layer only, no business logic
│   ├── <route>/        # file-based routing (can be [locale]/ for i18n)
│   ├── api/v<x>/       # route handlers (route.ts) — server-side HTTP endpoints
│   ├── page.tsx        # renders the matching feature's root component
│   ├── layout.tsx
│   ├── error.tsx       # error boundary UI
│   ├── not-found.tsx   # 404 UI
│   ├── loading.tsx     # suspense fallback UI
│   └── globals.css
├── actions/            # server actions
├── assets/             # static files (images, fonts, ...)
├── components/         # shared components
│   └── ui/             # shadcn primitives — do not edit unless explicitly asked
├── config/             # runtime config: exposed env vars, feature flags
├── constants/          # static business constants (enums, labels, magic strings)
├── features/           # feature modules
├── hooks/              # shared hooks
├── lib/                # preconfigured instances of external libs (api client, query client, ...)
├── providers/          # global context providers (theme, query client, auth, ...)
├── schemas/            # shared zod schemas
├── stores/             # global state stores
├── types/              # shared types with no corresponding schema
├── utils/              # pure shared utility functions
└── proxy.ts       # auth, redirects, i18n, ...

src/features/<feature>/
├── api/                # client-side API calls/hooks for this feature (fetches app/api or external endpoints)
├── actions/            # server actions for this feature
├── assets/             # feature-specific static files
├── components/         # components scoped to this feature
│   └── sections/       # composition blocks (optional)
│       └── <section-name>/
│           ├── <section-name>.tsx
│           └── ...
├── hooks/              # feature-scoped hooks
├── schemas/            # validation schemas
├── stores/             # feature-scoped state
├── types/              # feature-scoped types
├── utils/              # feature-scoped utilities
└── <feature>.tsx       # root component, rendered by app/<route>/page.tsx
```

Rules:

- Several folder names exist at both levels (`actions/`, `hooks/`, `schemas/`, `stores/`, `types/`, `utils/`). Directly under `src/` means shared across the app; under `src/features/<feature>/` means reserved to that feature.
- A feature must never import from another feature directly — compose at the app/ or shared component level.
- All folders are optional — only create what's needed.

---

# 4. Naming Conventions

## General Rules

- **Brevity**: Avoid redundant context and vague words such as `data`, `info`, `item`, or `manager` when they add no meaning.
- **Abbreviations**: Use only widely understood abbreviations such as `id`, `url`, `http`, or domain-standard terms.
- **Booleans**: Use a predicate prefix such as `is`, `has`, `can`, or `should` (e.g., `isValid`, `hasAccess`).
- **Affixes**: Do not add type, visibility, or pattern prefixes and suffixes unless the language ecosystem or an architectural role requires them.

## Files and Folders

- **Folders**: `kebab-case` (e.g., `error-handling`).
- **Files**: `kebab-case` unless a language, framework, or tool requires another format (e.g., `user-profile.ts`).
- **Tool-defined files**: Keep the canonical name and casing (e.g., `README.md`, `Dockerfile`, `package.json`).

## Environment Variables

- **Variables**: `SCREAMING_SNAKE_CASE` (e.g., `DATABASE_URL`).
- **Prefixes**: Use a stable application or tool prefix only when it prevents collisions or controls exposure (e.g., `MY_APP_API_URL`).

## JavaScript / TypeScript

- **Constants**: Use `SCREAMING_SNAKE_CASE` only for module-level symbolic constants (e.g., `MAX_FILE_SIZE`); use `camelCase` for ordinary `const` values.
- **Private members**: `camelCase`; use the language's `private` or `#` syntax instead of an underscore prefix.
- **Generics**: Use `T` for a simple generic or a descriptive name such as `TData` when several type parameters are present.
- **Tests**: `<source>.test.ts`
- **Declarations**: `<name>.d.ts` (e.g., `global.d.ts`).
- **Role-based files**: Use `<feature>.<role>.ts` when the architecture defines role-based files (e.g., `user.service.ts`, `user.schema.ts`).
- **Runtime schemas**: `camelCase` because schemas are values (e.g., `userSchema`).
- **Type names**: Do not add `I`, `Interface`, `Type`, or `Enum` merely to describe the declaration kind.

## React

- **Component files**: `kebab-case` (e.g., `user-profile.tsx`), even though the component itself is `PascalCase`.
- **Props**: `<ComponentName>Props` (e.g., `UserProfileProps`).
- **Contexts and providers**: `<Name>Context` and `<Name>Provider`.
- **Event props**: `on<Event>` (e.g., `onSubmit`); local handlers: `handle<Event>` (e.g., `handleSubmit`).

---

# 5. Coding Standards

## Architecture

- Prefer functional and declarative patterns.
- Avoid classes unless required by a framework or library.
- Reuse existing abstractions. Create a new abstraction only when repetition or multiple consumers justify it.

## Testing

- Never delete or weaken a test to make it pass; fix the code or ask for guidance if the test itself seems wrong.

## Error Handling

- The outermost layer owns the response: the global error handler/wrapper on the server, the error boundary or query error state on the client. Business logic, route handlers, and components never build an error response themselves.
- Never catch to swallow: no empty `catch`, no returning a default or empty value that hides the failure from the caller.
- Catch only to do one of three things: add context and rethrow (via `cause`), map a third-party error into a cataloged error, or apply a deliberate fallback the caller does not need to know about.
- Include actionable context in thrown errors (operation, relevant identifiers) without leaking sensitive data.

## Logging

- Route all logs through a single logger module/instance; never call the platform's raw console/print methods directly.
- Build each log entry as a single structured object carrying all relevant context (not a formatted string via concatenation).
- Render that object human-readable for the console and as JSON for persisted log files.
- Use levels deliberately: `error` for failures needing attention, `warn` for recoverable issues, `info` for significant state changes, `debug` for dev-only detail.

---

# 6. Project Conventions

## Commands

Package manager: **pnpm**. Never use `npm` or `yarn`, and never edit `pnpm-lock.yaml` by hand.

| Command | Purpose |
| --- | --- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Run the app in development |
| `pnpm build` | Production build |
| `pnpm start` | Run the production build |
| `pnpm lint` | Lint (add `--fix` to autofix) |
| `pnpm typecheck` | Type-check without emitting |
| `pnpm test` | Run the test suite once |
| `pnpm test <path>` | Run a single test file |
| `pnpm dlx shadcn@latest add <component>` | Add a shadcn primitive — never write `components/ui/` files by hand |
| `pnpm dlx <pkg>` | Run a package without installing it |

- These scripts are the canonical entry points; prefer them over invoking the underlying tools directly.
- After a change, run `pnpm lint` and the tests covering the touched code before reporting it done.

## TypeScript

- Rely on inference inside a module; add explicit types at module boundaries (exports, public APIs, configuration, external data).
- When a Zod schema already exists for a value, derive its type via `z.infer` instead of redeclaring it by hand.

## Environment variables

- Validate environment variables with a Zod schema in a dedicated `env` module.
- Store the validated result in a single exported `env` object instead of accessing `process.env` throughout the codebase.
- Use schema validation for type coercion (numbers, enums, URLs, etc.) rather than manual parsing.
- Avoid `process.env.VARIABLE!` outside the dedicated `env` module.

## React

- If the project uses i18n, manage all UI text through it; avoid hardcoded strings.
- Prioritize `Suspense` for granular loading states.
- Wrap independent sections in error boundaries, not just the app root, so one failing section doesn't blank the whole page.
- Prefer composition (children/slots) over deeply nested components or boolean/variant props for behavior differences.
- Use function declarations for exported components.
- Keep components focused on rendering; move business logic into hooks or services.
- Avoid unnecessary re-renders; use `memo`, `useMemo`, and `useCallback` strategically on the hot path, not by default everywhere.
- Serve optimized images and always reserve their layout space to avoid layout shift.

### State Management

- Default to component (local) state; lift it only when actually shared by multiple consumers.
- Treat server-originated data as cache, not local state: use React Query instead of copying API responses into a manually managed store.
- Reserve global stores for cross-cutting UI state (theme, navigation, active modal); never duplicate server data there.

### API Layer

- Centralize all outgoing API calls behind a single preconfigured client (base URL, auth headers, error normalization); features never call `fetch`/the HTTP client directly.
- The client unwraps the response envelope and maps failures to the shared error shape once, so features never re-implement parsing or error handling.
- Handle cross-cutting concerns (auth token injection/refresh, 401 handling) in the client, not in individual feature code.

## Next.js

No global middleware chain for API errors/logging (Route Handlers are isolated functions; `proxy.ts` runs before them, not around them) — use wrapper HOFs instead.

### App Router

- Default to Server Components. Use them for data fetching, backend access, and reducing bundle size.
- Keep `use client` as low as possible in the component tree; limit it to components that need Web APIs (`localStorage`, `window`) or direct interactivity (`onClick`, `onChange`).
- Use URL as the single source of truth where possible (e.g., via `nuqs`).
- Use Server Actions for data mutations.
- Use `revalidatePath` or `revalidateTag` to manage cache updates.
- Use App Router conventions: `loading.tsx`, `error.tsx`, and `not-found.tsx`.
- Use SSR for global data shared across multiple pages.
- Implement metadata via the Metadata API for SEO.
- Images: use the `<Image />` component, always set `width`/`height` or `fill`, prefer WebP/AVIF, lazy-load offscreen images.

### Route Handlers

- Wrap every route with `withApiHandler`: `export const GET = withApiHandler(async (req) => { ... })`
- `withApiHandler` catches errors, builds the `data`/`error` envelope, logs the request line.
- Route code never `try/catch`s.

### Server Actions

- Wrap every action with `withActionHandler`: `export const createOrder = withActionHandler(async (input) => { ... })`
- Log line: `ACTION` as `{method}`, action's dotted path (e.g. `features/checkout/actions/createOrder`) as `{endpoint}`.
- Actions resolve to `{ data }`/`{ error }`, never throw — an uncaught throw gets redacted in prod (loses `code`/`details`). `withActionHandler` catches, logs, resolves `{ error }`.

### Security

- Headers (CSP, HSTS, etc.): `next.config.js` `headers()`, not `helmet`.
- CORS: no `cors` package — set `Access-Control-*` explicitly (allow-list, no wildcard) in `withApiHandler`, handle `OPTIONS`.
- Rate limiting: in-memory counters don't survive serverless/edge — use an external store (e.g. Upstash Redis) in `proxy.ts` or `withApiHandler`.
- CSRF on Server Actions: already covered by Next's Origin header check.

---

# 7. Guidelines

- Never read `.env`. Maintain only `.env.example`.
- Never add or update dependencies without explicit user approval. Propose and justify any dependency that would materially improve the solution.

---

# 8. Security

- Follow the **OWASP Top 10** as the security baseline (broken access control, cryptographic failures, injection, XSS, secrets exposure).
- Validate and sanitize all input at system boundaries (API requests, forms, uploads) using the project's schema library.
