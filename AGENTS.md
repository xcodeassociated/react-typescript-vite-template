---
# AGENTS.md – Guidelines for Automated Agents
---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Common Development Commands](#common-development-commands)
   - [Running a Single Test](#running-a-single-test)
3. [Code‑Style & Conventions](#code‑style--conventions)
   - [Formatting (Prettier)](#formatting-prettier)
   - [Imports & Path Aliases](#imports--path‑aliases)
   - [TypeScript Rules](#typescript-rules)
   - [Naming Conventions](#naming-conventions)
   - [Error Handling](#error-handling)
   - [React & JSX Guidelines](#react--jsx-guidelines)
   - [Redux Toolkit Patterns](#redux‑toolkit-patterns)
   - [Apollo GraphQL Usage](#apollo‑graphql-usage)
   - [Testing Practices (Vitest & RTL)](#testing-practices-vitest--rtl)
4. [Linting & CI Details](#linting--ci-details)
5. [Cursor / Copilot Rules (if any)](#cursor--copilot-rules-if-any)
6. [Helpful References for Agents](#helpful-references-for-agents)

---

## Project Overview

- **Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS, Redux Toolkit (with persistence), Apollo Client, Keycloak, i18next.
- **Package Manager**: `npm` / `bun`. All scripts are defined in `package.json` and are **compatible with `bun run <script>`**.
- **Path Alias**: `@/*` resolves to `src/*` (defined in `vite.config.ts` & `tsconfig.json`).
- **Code Generation**: GraphQL types & hooks are generated via `npm run generate:graphql`.
- **Testing**: Vitest + React Testing Library + MSW for API mocking.
- **Formatting**: Prettier with `prettier-plugin-tailwindcss` (installed but configuration falls back to defaults).

---

## Common Development Commands

| Command                    | Description                                                         |
| -------------------------- | ------------------------------------------------------------------- |
| `bun run dev`              | Starts Vite dev server (default port 3000).                         |
| `bun run build`            | Type‑checks (`tsc -b`) then produces production bundle.             |
| `bun run preview`          | Serves the production build locally (`vite preview`).               |
| `bun run prod`             | Serves built assets with `serve -s dist`.                           |
| `bun run lint`             | Runs ESLint with `--max-warnings 0` – any warning fails the CI.     |
| `bun run test`             | Executes **all** Vitest tests in CI mode (`--run`).                 |
| `bun run test:ui`          | Opens Vitest UI for interactive debugging.                          |
| `bun run coverage`         | Generates coverage report (`--coverage`).                           |
| `bun run generate:graphql` | Re‑generates GraphQL hooks/types from `src/graphql/schema.graphql`. |

### Running a Single Test

Agents often need to run or debug a specific test file. Use any of the following patterns:

```bash
# Run a specific file (absolute or relative to repo root)
  bun run test -- src/components/Button.test.tsx
# Run tests matching a test name / regex pattern
  bun run test -- -t "Button renders correctly"
# Run only tests in a focused file (Vitest `--run` + `--watch` optional)
  bun run test -- src/pages/dashboard/Dashboard.test.ts --run
```

**Tip:** The double‑dash `--` separates the npm script arguments from the script itself.

---

## Code‑Style & Conventions

All agents should respect the linting rules defined in `.eslintrc.cjs`. The following conventions are **enforced** (or strongly recommended) by that config and the project's overall philosophy.

### Formatting (Prettier)

- Use **2‑space indentation** (Prettier default).
- **Trailing commas** where valid (objects, arrays, function parameters).
- **Single‑quotes** for strings, **double‑quotes** only when the string contains a single‑quote.
- **Semi‑colons** are required (`semi: true`).
- **Tailwind ordering**: thanks to `prettier-plugin-tailwindcss`, class names are automatically sorted alphabetically.
- Run `npm run lint` (which runs ESLint with Prettier integration) before committing.

### Imports & Path Aliases

1. **Group order** – separate with a blank line:

   ```ts
   // 1️⃣ External packages
   import React from 'react'
   import { useQuery } from '@apollo/client'

   // 2️⃣ Internal absolute imports (using @ alias)
   import { Button } from '@/components/ui/Button'
   import { useAppDispatch } from '@/store/hooks'

   // 3️⃣ Relative imports for sibling files
   import type { Props } from './MyComponent.types'
   import './MyComponent.css'
   ```

2. **Side‑effect only imports** (`import './polyfills';`) should appear **after** external imports but **before** internal imports.
3. **Alphabetical within groups**.
4. **Avoid wildcard imports** (`import * as Foo from ...`) unless you need the whole namespace.
5. **Prefer named imports** over default when the exported module provides multiple members.

### TypeScript Rules

- **`noImplicitAny`** and **`strict`** are enabled – never use `any`; prefer `unknown` or a precise type.
- **Explicit return types** for exported functions and React components.
- **Prefer `interface`** for object shapes that are extended; use `type` for unions, primitives, or tuples.
- **Readonly** for props and state objects that never change (`Readonly<T>` or `as const`).
- **Utility Types** (`Partial`, `Pick`, `Omit`) should be used sparingly – keep them readable.
- **Zod** is the validation library; always validate external data (`safeParse`) before using it.
- **Enums** only for a **closed set of string literals** that need runtime values; otherwise use union string literals.

### Naming Conventions

| Entity               | Convention                                                         | Example                           |
| -------------------- | ------------------------------------------------------------------ | --------------------------------- |
| Components           | **PascalCase** (+ optional `Component` suffix)                     | `UserCard`, `SettingsModal`       |
| Props types          | PascalCase ending in `Props`                                       | `UserCardProps`                   |
| Hooks                | `use` prefix + **camelCase**                                       | `useAuth`, `useFetchUsers`        |
| Redux slices         | `camelCase` slice name, file `sliceNameSlice.ts`                   | `counterSlice`                    |
| Actions / thunks     | `camelCase` prefixed with verb                                     | `fetchUserById`                   |
| Constants / env vars | **SCREAMING_SNAKE_CASE** (env vars start with `VITE_`)             | `VITE_APP_BACKEND_URL`            |
| Files & directories  | **kebab-case** (except React component files which use PascalCase) | `user-profile/`, `login-form.tsx` |

### Error Handling

- **Async functions**: `try { … } catch (err) { /* handle */ }` – re‑throw only if the caller can do something useful.
- **Network / GraphQL errors**: map to user‑friendly messages; never expose raw stack traces.
- **Zod validation**: use `result.success ? result.data : handleError(result.error)`.
- **React error boundaries**: provide a fallback UI for unexpected render errors.
- **Redux Toolkit**: `createAsyncThunk` automatically provides `rejected` action payload – keep error messages concise.

### React & JSX Guidelines

- **Functional components only** – no class components.
- **Hook Rules**: call hooks at the top level, never inside conditions or loops.
- **Destructure props** directly in the function signature when possible.
- **JSX Props**: boolean props omitted when true (`<Button disabled />`).
- **Conditional rendering**: use `&&` for simple cases, ternary for two alternatives, avoid nested ternaries.
- **Memoization**: `useMemo` for expensive calculations, `useCallback` for stable callbacks passed to children.
- **Styling**: Tailwind classes **only** – no custom CSS unless required for animations.
- **ARIA**: ensure accessible attributes (`aria-label`, `role`, etc.) are present on interactive elements.

### Redux Toolkit Patterns

```ts
// store/store.ts – typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

- **Slices** should be kept small – one slice per domain.
- **Immer** is used automatically; mutate state directly in reducers.
- **Async logic** lives in `createAsyncThunk`; keep reducers pure.
- **Selectors** are memoized with `createSelector` when derived data is expensive.

### Apollo GraphQL Usage

- **Generated hooks** (`useGetUserQuery`, `useUpdateUserMutation`) are the only way to interact with the API.
- **Error/Loading** handling pattern:
  ```tsx
  const { data, loading, error } = useGetUserQuery({ variables: { id } })
  if (loading) return <Spinner />
  if (error) return <ErrorMessage error={error} />
  // render UI with data
  ```
- **Cache updates**: use `refetchQueries` or the `update` function for mutations that affect the cache.
- **Authentication**: token is injected via Apollo `authLink` – never manually attach `Authorization` header in components.

### Testing Practices (Vitest & RTL)

- **File naming**: `ComponentName.test.tsx` placed alongside the component or in `__tests__/`.
- **Test runner**: `bun run test` (CI) or `bun run test:ui` for debugging.
- **Render**: use `render(<Component …/>)` from `@testing-library/react`.
- **Assertions**: prefer `expect(element).toBeInTheDocument()` and `toHaveAttribute`.
- **Mocking**: use **MSW** for network calls; define handlers in `src/mocks/handlers.ts`.
- **Coverage**: aim for **≥ 90 %** on new/changed code; `bun run coverage` will output the report.
- **Selective test runs**: use `.only` or the `-t` flag (see _Running a Single Test_ above).

---

## Linting & CI Details

- The **ESLint** config extends `eslint:recommended`, `@typescript-eslint/recommended`, and `plugin:react-hooks/recommended`.
- **Prettier** is enforced via `eslint-config-prettier` – any formatting deviation is reported as an ESLint error.
- **`npm run lint`** fails on **any warning** (`--max-warnings 0`).
- CI (GitHub Actions) runs `npm ci && npm run lint && npm run test && npm run coverage`.
- No `--fix` flag is used in CI – agents must commit correctly formatted code.

---

## Cursor / Copilot Rules (if any)

The repository does **not** contain a `.cursor/` directory or a `.github/copilot-instructions.md` file, so there are no additional cursor‑specific or Copilot‑specific guidelines to enforce.

---

## Helpful References for Agents

- **Vite Guide** – https://vitejs.dev/guide/
- **Vitest Docs** – https://vitest.dev/guide/
- **React Hook Rules** – https://reactjs.org/docs/hooks-rules.html
- **Redux Toolkit FAQ** – https://redux-toolkit.js.org/faq
- **Apollo Client Docs** – https://www.apollographql.com/docs/react/
- **Zod Handbook** – https://zod.dev/
- **Tailwind CSS** – https://tailwindcss.com/docs
- **Prettier Plugin TailwindCSS** – https://github.com/tailwindlabs/prettier-plugin-tailwindcss

---

**Agent Restrictions**: Agents must not modify any files outside the project directory. 

**CRITICAL:** Agents must **never** commit any changes without **explicit user permission**. ALWAYS ask for review and obtain approval **before** running any `git add` / `git commit` commands.

**Shell Environment**: Agents should execute commands using **zsh** (as the user’s default shell) to ensure compatibility with tools installed in that environment.

**Node Version Management**: Agents must always verify that **nvm** (Node Version Manager) is installed before invoking any `node` or `npm` commands. If `nvm` is not available, they should inform the user and suggest installing it. Agents should never run Node directly without first ensuring the appropriate version is selected via `nvm`.

**Package Manager Preference**: All dependency management should be performed using **bun**. Agents must use `bun install` (or `bun add`/`bun remove` as appropriate) instead of `npm install`. Before running any bun command, agents must check that **bun** is installed; if it is missing, they should inform the user and suggest installing bun (e.g., via `curl -fsSL https://bun.sh/install | bash`).

**Branch Management**: Agents must avoid making code changes directly on the **main** (or **master**) branch. Any modification to code should be performed on a separate feature branch. Agents should always ask for explicit user permission before creating a new branch, and must recommend creating one when working on the main branch.

_End of file – agents should keep this document up to date as the project evolves._
