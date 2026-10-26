# React + TypeScript + Vite — Application Starter Template

A **service template** for bootstrapping new web applications. It is not an application itself — it is a
ready-to-hack foundation with all the boring parts already wired up, so you can go from `git clone` to a
working, authenticated, tested, deployable app in minutes and spend your time on the actual idea instead of
the plumbing.

**Primary purpose: rapid prototyping and validating ideas.** Every common concern of a modern SPA —
authentication, state, API access, typed GraphQL, i18n, theming, UI components, testing, containerization,
and CI/CD — is pre-configured and demonstrated with small example pages you can keep or delete.

---

## What you get out of the box

| Concern              | Solution                                                       |
| -------------------- | -------------------------------------------------------------- |
| Build tooling        | Vite 7 with SWC (`@vitejs/plugin-react-swc`) — instant HMR     |
| Language             | TypeScript (strict), Node ≥ 22.12, package manager **bun**     |
| UI framework         | React 19                                                       |
| Styling              | Tailwind CSS v4 + shadcn/ui (Radix primitives) + dark mode     |
| Authentication       | Keycloak (`keycloak-js` + `@react-keycloak/web`), silent SSO   |
| Client state         | Redux Toolkit with `redux-persist` (example: persisted counter)|
| Server state (REST)  | RTK Query with Keycloak token injection (example: users API)   |
| Server state (GraphQL)| Apollo Client 4 + GraphQL Codegen typed documents             |
| Realtime             | SSE hook with auto-reconnect (`useSimpleSSE`)                  |
| Data grid            | TanStack Table wrapped in a reusable `DataTable` component     |
| Forms & validation   | react-hook-form + zod resolvers                                |
| i18n                 | i18next with browser language detection (en / pl examples)     |
| Testing              | Vitest + React Testing Library + MSW (API mocking)             |
| Linting / formatting | ESLint + Prettier (tailwind class sorting)                     |
| Deployment           | Multi-stage Dockerfile (bun build → nginx) + GitHub Actions    |

## Backend companion

This frontend pairs with the **`spring-reactive-template`** backend service — a matching service template so
you can stand up a full stack (front + back + auth) in minutes, not wire up a backend from scratch.

- **Repository**: https://github.com/xcodeassociated/spring-reactive-template (MIT, `main`)
- **Stack**: Kotlin · Spring Boot (WebFlux + coroutines) · reactive MongoDB · Kafka · **Keycloak** · GraphQL · REST · SSE · gRPC
- **What it provides**: the same "everything pre-wired, just start building" philosophy on the server side —
  Keycloak auth, a reactive MongoDB store, Kafka eventing, and GraphQL/REST/SSE endpoints the frontend examples call out of the box
- **Local infra**: its `docker-compose.yml` brings up Kafka + Keycloak/PostgreSQL + a MongoDB replica set. This is the
  stack referred to below as **`dev-infra`** — start it, then run `bun run dev` here

The REST (`/coroutine/users`), GraphQL (`/graphql`) and SSE (`/update/user`) endpoints exercised by the `users`
page all map to controllers in that repo, and `src/graphql/schema.graphql` mirrors its GraphQL schema.

## Features

- **Keycloak authentication wired end-to-end**
  - `ReactKeycloakProvider` with `check-sso` and a silent-SSO redirect page (`public/silent-check-sso.html`)
  - Access token automatically attached to GraphQL (Apollo `authLink`) and REST (RTK Query `prepareHeaders`) calls
  - Route guards (`ProtectedRoute`), auth-aware navigation menu, user dropdown with login/logout
- **Typed API access, two ways**
  - REST via RTK Query — caching, tag invalidation, optimistic-friendly (`src/pages/users/api`)
  - GraphQL via Apollo + codegen — typed queries written inline as ``graphql`…` `` template literals, generated from the schema with `bun run generate:graphql`
- **Live data example** — Server-Sent Events hook (`useSseUsers`) demonstrating realtime updates with retry/backoff
- **State management example** — Redux Toolkit slice with `redux-persist` (counter page) plus typed `useAppDispatch` / `useAppSelector` hooks
- **Polished app shell** — sticky header, responsive side menu (sheet), search bar, footer, loading screen, error/unauthorized pages
- **shadcn/ui component library** — buttons, dialogs, forms, selects, dropdowns, command palette (cmdk), tables, etc.
- **Grouped multi-select** — cmdk-based `MultipleSelector` (creatable options, async debounced search, max-selection
  limits) used for role picking in the user dialog
- **Dark / light theme toggle** via a theme provider
- **Internationalization** — language switcher in the user menu, detection via cookie/localStorage/navigator
- **Cookie consent banner** with accept/decline callbacks
- **Testing setup** — unit/component tests colocated with sources, MSW `setupServer` for API mocking
  (see `src/pages/users/Users.test.tsx`), coverage via V8
- **CI/CD pipelines**
  - `ci.yml` — install → GraphQL codegen → tests → build on every push/PR
  - `main-branch-docker.yml` — multi-arch Docker image built and published to Docker Hub on `main` / `release/*`
- **Production container** — `Dockerfile` builds with bun and serves a static bundle behind nginx with SPA fallback and a `/health` endpoint

## Project structure

```text
.
├── public/                      # Static assets (incl. silent-check-sso.html for Keycloak)
├── src/
│   ├── assets/                  # Images/icons
│   ├── components/
│   │   ├── app/                 # App shell: nav, side menu, user dropdown, loading screen
│   │   ├── custom/              # Project-level components: data table, cookie consent,
│   │   │                        #   mode toggle, multi-selector, spinner
│   │   ├── ui/                  # shadcn/ui primitives (button, dialog, form, table, …)
│   │   └── theme-provider.tsx   # Light/dark theme provider
│   ├── graphql/
│   │   ├── schema.graphql       # Backend schema (source of truth for codegen)
│   │   └── generated/           # Generated typed documents/hooks (never edit — regenerated)
│   ├── lib/
│   │   ├── keycloak.ts          # Keycloak instance (realm `app`, client `frontend`)
│   │   └── utils.ts             # cn() helper (clsx + tailwind-merge)
│   ├── locales/
│   │   ├── i18n.ts              # i18next init + language detection
│   │   └── lang/                # Translation files (en_US.json, pl_PL.json)
│   ├── pages/
│   │   ├── counter/             # Example: Redux Toolkit slice + redux-persist
│   │   ├── error/               # Error & unauthorized pages
│   │   ├── home/                # Public landing page
│   │   └── users/               # Example: protected CRUD page
│   │       ├── api/             #   RTK Query endpoints + types
│   │       ├── components/      #   User edit dialog
│   │       └── hooks/           #   TanStack columns, GraphQL roles, SSE live updates
│   ├── store/                   # Redux store setup, typed dispatch/selector hooks
│   ├── App.tsx                  # Layout, routing, menu, route guards
│   ├── App.css                  # Tailwind v4 entry + theme tokens (@theme)
│   ├── main.tsx                 # Providers: Keycloak, theme, Redux, Router, Apollo
│   └── setupTests.ts            # Vitest global setup (jest-dom matchers, browser API mocks)
├── .github/workflows/           # CI (test+build) and Docker publish pipelines
├── codegen.ts                   # GraphQL Codegen configuration
├── components.json              # shadcn/ui configuration
├── vite.config.ts               # Vite + Vitest config (port 3000, @ alias)
├── Dockerfile                   # bun build → nginx static serve
├── nginx.conf                   # SPA fallback + /health endpoint
└── .env / .env.production       # VITE_APP_* environment variables
```

## Getting started

### Prerequisites

- [bun](https://bun.sh) (all scripts use `bun run …`)
- Node ≥ 22.12.0 (see `.nvmrc`; use `nvm install && nvm use` if you manage Node with nvm)
- A running backend stack for login and data pages:
  | Dependency | URL | Used by |
  | ---------- | --- | ------- |
  | Keycloak   | `http://localhost:8090` | login (`VITE_APP_KEYCLOAK_URL`) |
  | Backend REST/GraphQL | `http://localhost:8080` | users page (`VITE_APP_BACKEND_URL`) |

  These run in the sample backend's compose stack — see [Backend companion](#backend-companion). Bring it up
  first, then start the frontend.

### Install & run

```bash
bun install
bun run generate:graphql   # regenerate typed GraphQL documents (required before test/build)
bun run dev                # http://localhost:3000
```

### Environment variables

| Variable                 | Description                        | Local default            |
| ------------------------ | ---------------------------------- | ------------------------ |
| `VITE_APP_DOMAIN`        | Public URL of this app             | `http://localhost:3000`  |
| `VITE_APP_KEYCLOAK_URL`  | Keycloak server URL                | `http://localhost:8090`  |
| `VITE_APP_BACKEND_URL`   | Backend REST/GraphQL URL           | `http://localhost:8080`  |

Keycloak is configured for realm `app`, client `frontend`, with `check-sso` on load (the app renders
publicly; protected routes require login).

## Scripts

| Command                    | Description                                                          |
| -------------------------- | -------------------------------------------------------------------- |
| `bun run dev`              | Start Vite dev server on port 3000                                   |
| `bun run build`            | Production build                                                     |
| `bun run preview`          | Preview the production build locally                                 |
| `bun run prod`             | Serve `dist/` with `serve -s`                                        |
| `bun run lint`             | ESLint (`--max-warnings 0` — any warning fails)                      |
| `bun run test`             | Run all Vitest tests once                                            |
| `bun run test:ui`          | Open the Vitest UI                                                   |
| `bun run coverage`         | Run tests with V8 coverage report                                    |
| `bun run generate:graphql` | Regenerate typed GraphQL documents from `src/graphql/schema.graphql`  |

> **Note:** `generate:graphql` must run before `test` or `build` (CI does this too), and
> `src/graphql/generated/` is auto-generated — never edit it by hand.

## Using this as a template

1. **Clone / use this repo as a template**, then rename: `package.json` name, `index.html` title,
   `src/locales/lang/*.json` app name.
2. **Point the env vars** at your Keycloak realm/client and backend (see table above), and adjust
   `src/lib/keycloak.ts` if the realm or clientId differ.
3. **Replace the schema**: drop your backend's `schema.graphql` into `src/graphql/` and run
   `bun run generate:graphql`.
4. **Keep or delete the examples**: the `counter` and `users` pages demonstrate the intended patterns
   (persisted Redux state, RTK Query, GraphQL, SSE, data table, protected routes). Removing them and their
   menu entries in `src/App.tsx` leaves a clean shell.
5. **Add your own pages** under `src/pages/<feature>/` following the colocated
   `api/ components/ hooks/` layout.
6. **Set up CI secrets** (`DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `VITE_APP_*`) if you want the Docker
   publish pipeline.

## License

MIT — see [LICENSE.md](LICENSE.md).
