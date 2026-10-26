# AGENTS.md – Guidelines for Automated Agents

## Project Overview

- **Purpose**: Frontend **service template** for rapidly prototyping web apps. Auth (Keycloak), state, REST + GraphQL API access, i18n, theming, UI kit, tests, Docker and CI are pre-wired; example pages (`counter`, `users`) demonstrate the intended patterns. See `README.md`.
- **Tech stack**: React 19, TypeScript (strict), Vite 7 + SWC, Tailwind CSS **v4 (CSS-first, no `tailwind.config.js`)**, shadcn/ui + Radix, Redux Toolkit + `redux-persist` + RTK Query, Apollo Client **v4**, `keycloak-js` 26, i18next, react-hook-form + zod, Vitest 4 + RTL + MSW.
- **Package manager**: `bun` only (never npm/pnpm/yarn). Node ≥ 22.12.0 (`.nvmrc`, `engines`).
- **Path alias**: `@/*` → `src/*` (defined in `tsconfig.json`/`tsconfig.app.json`; Vite resolves it via `vite-tsconfig-paths` plus an explicit alias in `vite.config.ts`).
- **Dev server**: `http://localhost:3000` (host `0.0.0.0`).

## Key Paths

| Path | What lives there |
| --- | --- |
| `src/main.tsx` | Provider tree: Keycloak → Theme → Redux(+persist) → Router → Apollo |
| `src/App.tsx` | Layout, routes, menu, `ProtectedRoute` guards |
| `src/lib/keycloak.ts` | Keycloak instance: realm `app`, client `frontend`, URL from `VITE_APP_KEYCLOAK_URL` |
| `src/components/ui/` | shadcn primitives (generated; some lint rules relaxed here) |
| `src/components/custom/`, `src/components/app/` | Project components (data table, cookie consent, nav, user menu…) |
| `src/pages/<feature>/` | Feature pages with colocated `api/`, `components/`, `hooks/`, tests |
| `src/graphql/schema.graphql` → `src/graphql/generated/` | Codegen input → output (client preset, fragment masking) |
| `src/store/` | Redux store setup + typed `useAppDispatch`/`useAppSelector` |
| `src/locales/` | i18next init + `en_US.json`, `pl_PL.json` |
| `.github/workflows/` | `ci.yml` (install → codegen → test → build) and `main-branch-docker.yml` (multi-arch image publish on `main`/`release/*`) |

## Commands

**CRITICAL:** Always run `bun run generate:graphql` **before** `bun run test` or `bun run build` (CI does this too). It regenerates `src/graphql/generated/` from `src/graphql/schema.graphql` and documents found in `src/**/*.{ts,tsx,graphql}`.

| Command | Description | Verified |
| --- | --- | --- |
| `bun run dev` | Vite dev server on port 3000 | – |
| `bun run build` | Production bundle (`vite build`; no separate `tsc` step) | ✓ passes |
| `bun run preview` / `bun run prod` | Serve build locally (`vite preview` / `serve -s dist`) | – |
| `bun run lint` | ESLint flat config (`eslint.config.mjs`), `--max-warnings 0` | ✗ currently fails (see Gotchas) |
| `bun run test` | All Vitest tests once (`vitest --run`) | ✓ 3 files / 6 tests pass |
| `bun run test:ui` / `bun run coverage` | Vitest UI / V8 coverage | – |
| `bun run generate:graphql` | Regenerate GraphQL types/hooks | ✓ passes |

### Running a Single Test

```bash
bun run test -- src/App.test.tsx            # one file
bun run test -- -t "renders correctly"      # by test name
```

## Local Login (Keycloak)

The frontend shell renders standalone, but login and data pages (`/users`) require the backend stack — provided by the companion backend template repo [spring-reactive-template](https://github.com/xcodeassociated/spring-reactive-template), run locally as the `dev-infra` compose stack — start it **before** `bun run dev`:

| Dependency | URL | Used by |
| --- | --- | --- |
| Keycloak | `http://localhost:8090` | `VITE_APP_KEYCLOAK_URL` (login) |
| Backend REST/GraphQL | `http://localhost:8080` | `VITE_APP_BACKEND_URL` (`/users`, `/graphql`) |
| Kafka, PostgreSQL | internal | Keycloak storage & events |

- **Login**: user menu (top right) → **Login** → Keycloak sign-in. **Logout** hides the `Counter`/`Users` nav entries again.
- **Credentials**: realm `app`, client `frontend`, user `user` / `user@user.com` – stored in the git-ignored `.credentials` file. Never commit or print the password; the trailing `?` **is** part of it.
- **Missing `.credentials`**: stop and inform the developer. Do not guess credentials, create the file, or reset passwords unless explicitly asked.
- **Verified success**: `Counter` and `Users` appear in the nav and requests to `localhost:8080` return `200`.
- **Browser MCP**: use the Playwright MCP (`browser_navigate`, `browser_snapshot`, `browser_click`, …). Keycloak only logs *failed* logins (`LOGIN_ERROR`), so confirm success from the UI/network, not `docker logs`.

## Conventions

- **Formatting** (Prettier via ESLint, `.prettierrc.json`): **no semicolons**, single quotes, `printWidth: 120`, 2-space indent, trailing commas (es5), Tailwind class sorting via `prettier-plugin-tailwindcss`.
- **ESLint** (`eslint.config.mjs`, flat config): `eslint:recommended` + `@typescript-eslint/recommended` + `react-hooks/recommended` + prettier, plus **`@shadcn/lint` error-level rules** (`no-arbitrary-values`, `no-raw-colors`, `no-inline-styles`, `require-static-classes`, `no-restyle` with `layout` allowed). These apply to all code **except `src/components/ui/**`** — write app UI with theme tokens and static Tailwind classes, not one-off values. `dist`, `coverage` and `src/graphql/generated` are ignored.
- **Styling**: Tailwind classes only; theme tokens are defined CSS-first in `src/App.css` (`@theme`, shadcn HSL variables). There is no `tailwind.config.js`.
- **TypeScript**: `strict`, `noImplicitAny`, `noUnusedLocals/Parameters`. Never `any` — use `unknown` or a precise type. Explicit return types for exported functions/components. Prefer `interface` for object shapes, union literals over enums.
- **GraphQL (Apollo 4)**: write inline typed documents with the `graphql` template literal from `@/graphql/generated/` and execute via `useQuery`/`useMutation` from `@apollo/client/react` (see `src/pages/users/hooks/useRolesGraphql.tsx`). There are **no generated `useXxxQuery` hooks**. The token is attached by `authLink` in `src/main.tsx` — never set `Authorization` manually in components.
- **REST**: use RTK Query slices (see `src/pages/users/api/usersApi.ts`, base URL `VITE_APP_BACKEND_URL + '/coroutine'`); `prepareHeaders` injects the Keycloak token.
- **Redux**: one slice per domain, Immer mutations in reducers, async in `createAsyncThunk`; typed hooks from `src/store/hooks.ts`.
- **Auth-gated routes**: wrap with `ProtectedRoute predicate={keycloak?.authenticated}` in `src/App.tsx` and mark menu items `restricted: true`.
- **i18n**: all user-facing strings via `useTranslation` (`main` namespace, `src/locales/lang/*.json`); language switcher lives in the user dropdown.
- **Naming**: components PascalCase; props types `…Props`; hooks `useCamelCase`; files/dirs kebab-case (except component files); env vars `VITE_APP_*`.
- **Imports**: external → blank line → `@/` absolute → relative; alphabetized within groups; side-effect imports after externals.
- **Testing**: colocate `Component.test.tsx`; MSW `setupServer` is set up **inside test files** (see `src/pages/users/Users.test.tsx`); `src/setupTests.ts` only bootstraps jest-dom matchers and browser-API mocks. Aim for ≥90% coverage on new code.

## Gotchas

- **`bun run lint` currently fails** (~76 `shadcn/*` errors in pre-existing components) because the ESLint flat-config migration is in progress in the working tree (`.eslintrc.cjs` deleted, `eslint.config.mjs` untracked). Do not "fix" unrelated components just to green the lint run; flag it to the developer. CI does **not** run lint.
- `bun run build` does **not** type-check (`vite build` only). Type-check manually with `bunx tsc -b` when touching types.
- CI (`ci.yml`) runs install → `generate:graphql` → `test` → `build`. It does **not** run lint or coverage.
- `src/graphql/generated/` is git-ignored and regenerated — if tests/build complain about missing `graphql` exports, run `bun run generate:graphql` first.
- Keycloak `onLoad: 'check-sso'` with `silent-check-sso.html` from `public/`; `checkLoginIframe: false`. Auth state arrives asynchronously — `App.tsx` renders `LoadingScreen` until `initialized`.
- Vitest `globals: true` + jsdom are configured inside `vite.config.ts` (not a separate vitest config file).
- Build warns about chunk size >500 kB — known, not blocking.

## Agent Restrictions

- Never modify auto-generated files, especially `src/graphql/generated/**`.
- Never commit without explicit user permission; always ask for review before any `git add`/`git commit`.
- Avoid code changes directly on `main`/`master`; work on a feature branch and ask permission before creating one (this repo currently has uncommitted work on `main` — check `git status` first).
- Use `bun` for every dependency/command; if missing, tell the developer (suggest `curl -fsSL https://bun.sh/install | bash`). Before any `node` call, ensure nvm is available and the right version selected; if nvm is missing, inform the developer.
- Do not modify files outside the project directory.
- **Keep `README.md` current.** Whenever development changes anything the README documents (features, commands, scripts, environment variables, tech stack, project structure, setup/deployment steps), update `README.md` in the same change before considering the work done. The README must always reflect the current state of the project; never finish a task that leaves it stale.

## Maintaining This File

Update this guide when commands, scripts, CI steps, provider wiring, lint configs or the dev-infra topology change. Prefer deleting stale guidance over annotating it; verify any command you document by running it (or mark it unverified).
