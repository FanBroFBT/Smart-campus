# Project memory

## Product intent & audience

- Time-based availability checker web app (vite-react). Users enter a current time and check availability against configured schedule data.

## Brand personality & voice

- Production-quality, beautiful, non-cookie-cutter UI (per `.bolt/prompt`).

## Visual design & UX direction

- JSX + Tailwind CSS classes; React hooks; Lucide React icons (per `.bolt/prompt`).
- `@/` path alias maps to `src/`.
- No extra UI/icon/theme packages beyond defaults unless explicitly requested.

## Decisions, constraints & rationale

- Testing stack: `vitest` already in devDependencies; `npm test` runs `vitest run src`.
- Safe commands (AGENTS.md): `npm install`, `npm test`, `npm run typecheck` (`tsc --noEmit -p tsconfig.app.json`), `npm run lint`, `npm run build`. All must pass before marking change done.
- Core utilities live in `src/utils.ts`: `labelToMinutes(label): number | null` (strict HH:MM parser; rejects `24:00`, `12:60`, `9:5`, `''`, non-numeric) and `minutesToLabel(minutes): string` (wraps 1440 → `00:00`).
- Schedule/source data lives in `src/data.ts`.
- `src/App.tsx` uses `currentTime = labelToMinutes(currentTimeLabel)` (nullable, no `?? 0` fallback) and treats `currentTime === null` as the missing/invalid-time condition instead of re-checking the raw string.
- User workflow preference: show diffs first, get explicit approval before applying; restrict changes to named files; no refactoring or new dependencies unless requested.
- Bug investigation artifacts (`bug-*`) exist in repo but are out of scope for normal patches.

## Open questions & assumptions

- Assumes existing `src/utils.ts` exports `labelToMinutes` and `minutesToLabel` with the signatures/behaviors covered by tests.
- No UI/styling decisions inferred yet beyond template defaults.