# Patient Data Management

A single-page application for managing patient records. It fetches patients from a remote API, displays them as a searchable, sortable card list, and lets users view full details, add new patients, and edit existing ones. All mutations are local-state-only, the API is read-only after the initial fetch. Built as a frontend technical challenge.

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev
```

### Available scripts

| Script | Description |
|---|---|
| `dev` | Start the Vite development server |
| `build` | Type-check and produce a production bundle |
| `type-check` | Run the TypeScript compiler without emitting (strict mode) |
| `lint` | Run ESLint across the project |
| `format` | Format source files with Prettier |
| `format:check` | Check formatting without writing (useful in CI) |
| `test` | Run the full test suite once with Vitest |
| `test:watch` | Run Vitest in watch mode |
| `preview` | Serve the production build locally |

---

## Project Structure

```
src/
├── features/
│   └── patients/
│       ├── types/          # Patient type, form types (Zod schemas + z.infer)
│       ├── services/       # patientsService — the only place that talks to the API
│       ├── hooks/          # usePatients — data fetching and state mutations
│       └── components/     # PatientList, PatientCard, PatientDetailModal, PatientFormModal
├── components/             # Generic, reusable UI: Modal, Avatar, Input, Textarea,
│                           #   SearchInput, Spinner, Toast
├── lib/                    # Pure utility functions: URL validation/normalization,
│                           #   search normalization, sort logic
├── test/                   # Global test setup (happy-dom, jest-dom matchers)
├── App.tsx
└── main.tsx
```

The organizing principle: generic UI components have no knowledge of patients or any other domain. `patientsService` is the only module that calls `fetch`. `usePatients` is the only place that owns the patient list state — all components receive data and callbacks as props.

---

## Technical & Design Decisions

### Dirty data handling

The API returns records with invalid fields (e.g. `avatar: {}`), names with leading whitespace, extra unknown fields (e.g. `password`, `body`), and missing properties. A permissive Zod ingestion schema (`patientApiSchema`) uses `.catch()` on every field so a bad value coerces to a safe default rather than failing the whole parse. A `.transform()` on the `name` field trims whitespace at the source. Zod strips unknown fields by default, so `password` and similar fields never reach the application. Individual records are parsed with `safeParse` — one corrupt record does not break the whole list.

### Dual Zod schemas

There are two separate schemas: `patientApiSchema` (permissive, for ingestion) and `patientFormSchema` (strict, for user input). The form schema validates `website` and `avatar` URLs using the same `isValidWebsiteUrl` and `isValidImageUrl` helpers used for display. This means the validation criterion for "is this a valid URL worth rendering?" is consistent across layers — if the display layer would reject it, the form layer rejects it too.

### Local state without a global store

Patient state lives in the `usePatients` hook. `addPatient` and `editPatient` are synchronous local mutations. The spec explicitly states no persistence, so there is no write API to call and no need for optimistic update/rollback machinery. A global store (Redux, Zustand) would add indirection and boilerplate without solving any problem at this scope.

### Accessible modal from scratch

The `Modal` component implements focus trap, scroll lock with scrollbar-width compensation, Escape key handling, focus restoration on close, and correct ARIA attributes (`role="dialog"`, `aria-modal`, `aria-labelledby`) — all without a library. Scroll lock uses `useLayoutEffect` so the compensation is applied before the browser paints, avoiding a one-frame layout shift. The scrollbar width is measured before hiding overflow, then exposed as a CSS custom property (`--scrollbar-width`) so the overlay and the fixed FAB can shift their right edge by the same amount and stay on the same horizontal axis as the content.

### Search implementation

Search is a case- and accent-insensitive substring match on patient name. The `normalizeForSearch` utility applies Unicode NFD normalization followed by diacritic stripping (`/\p{Diacritic}/gu`), then lowercases, so "penelope" matches "Penélope". Filter state lives in `App` as derived view state and is computed with `useMemo`. There is no debounce — the dataset is small and filtering is synchronous; debounce would add visible latency with no benefit.

### Sort implementation

Three sort options: Name A–Z (via `Intl.Collator` with `sensitivity: 'base'` for locale-aware, accent-insensitive comparison), Newest first, and Oldest first. The date comparator uses `Date.parse` with an explicit `NaN` guard — records with an unparseable `createdAt` sort to the end rather than producing undefined behavior. Sort state is also view-layer UI state, chained after the search filter with a second `useMemo`. A native `<select>` was chosen over a custom dropdown: it is accessible by default, opens the OS-native picker on mobile, and avoids rebuilding behavior the browser already handles correctly.

### Scroll architecture

The app header and the search/sort bar are both `position: sticky` so they remain visible as the list scrolls. `scrollbar-gutter: stable` is set on the root element unconditionally, reserving the scrollbar channel whether or not the page is long enough to scroll. This prevents layout shift when the scrollbar appears or disappears and keeps the search bar and card columns on the same horizontal axis at all viewport heights.

### Detail modal vs. expand/collapse

The detail view uses a modal rather than in-place card expansion. Expanding a card in a list causes grid reflow that shifts unrelated cards — this is disorienting and gets worse on mobile where the expanded card may push other content completely off screen. A modal keeps the detail view focused, is accessible by the same keyboard and ARIA contract as the add/edit modal, and reuses the same `Modal` component.

### Design system

The design uses a warm custom palette defined as Tailwind v4 CSS custom properties in `@theme`. Color is role-based: `--color-action` (forest green `#004A3D`) is used exclusively for create/confirm actions; `--color-identity` (teal `#1B6373`) for navigation and branding; `--color-background` (warm cream `#F0E8DB`) for page surfaces. Typography uses a single family (Plus Jakarta Sans Variable) with hierarchy expressed through weight and size. Elevation is expressed through three named shadow levels — `resting`, `elevated`, `floating` — rather than color changes, keeping shadows warm-tinted to match the palette.

---

## Libraries & Tools

| Package | Version | Purpose |
|---|---|---|
| `react` | ^19.2.6 | UI rendering |
| `react-dom` | ^19.2.6 | DOM bindings for React 19 |
| `vite` | ^8.0.12 | Development server and production bundler |
| `typescript` | ~6.0.2 | Static typing with strict mode enabled |
| `tailwindcss` | ^4.3.0 | Utility-first CSS; v4's `@theme` block is used for design tokens |
| `zod` | ^4.4.3 | Schema validation and type inference for both API ingestion and form validation |
| `react-hook-form` | ^7.77.0 | Form state, dirty tracking, and submission handling |
| `@hookform/resolvers` | ^5.4.0 | Zod adapter for React Hook Form |
| `vitest` | ^4.1.7 | Test runner (Vite-native, no config overhead) |
| `@testing-library/react` | ^16.3.2 | Component testing via user-centric queries |
| `@testing-library/user-event` | ^14.6.1 | Realistic user interaction simulation |
| `eslint` | ^10.3.0 | Linting with TypeScript and React Hooks rules |
| `prettier` | ^3.8.3 | Consistent code formatting |
| `@fontsource-variable/plus-jakarta-sans` | ^5.2.8 | Self-hosted variable font; no external font request |

---

## Testing

Tests target observable behavior and public contracts, not implementation details. A component test should break when behavior changes, not when a variable is renamed.

**Coverage by area:**

- **Schema normalization** — dirty API data, edge cases (missing fields, wrong types, extra fields), whitespace trimming, URL field handling
- **URL utilities** — normalization, validation, hostname edge cases (bare hostnames, IP addresses, protocol inference)
- **Modal** — focus trap (forward and backward Tab), Escape key, scroll lock and restore, focus restoration on close
- **Avatar** — image load success, `onError` fallback to initials, initials generation from various name formats
- **PatientCard and PatientList** — rendering states (loading, error, empty, populated), interactions, ARIA labels
- **usePatients hook** — fetch lifecycle (loading → success, loading → error), stale-setState prevention on unmount via a `cancelled` boolean flag, local `addPatient` and `editPatient` mutations
- **PatientFormModal** — validation flow (required fields, URL format), edit pre-population from existing patient, Save button enabled only when form is valid and dirty
- **SearchInput** — controlled value, clear button visibility and behavior, Escape key clear, focus retention after clear
- **Search and sort** — accent-insensitive matching, no-match empty state, sort ordering, composition of search filter and sort together
- **App integration** — full render with mocked service, search + sort interaction, patient count display

**109 tests across 15 files.**
