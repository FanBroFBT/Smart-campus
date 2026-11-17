# AGENTS.md — Smart Campus Room Availability Checker

## Scope
- This repo contains ONE app: a client-side room availability checker (Vite + React + TypeScript).
- One fictional room dataset (`src/data.ts`). No login. No real database. No real personal data.
- Do not add authentication, a backend/database, or any external production service
  (the `@supabase/supabase-js` dependency in package.json is currently UNUSED —
  do not wire it up without explicit human approval).

## Acceptance contract to preserve (do not weaken)
- AC1: reject invalid/past times (`0 <= start < end <= 1440`, `start > currentTime`).
- AC2: reject durations over 120 minutes.
- AC3: reject bookings for a blocked room.
- AC4: reject overlaps with existing bookings; touching endpoints are allowed (strict `<`).
- AC5: `checkAvailability` must never mutate the `Room`/`Booking` data it receives.

## Safe commands
- Install: `npm install`
- Test: `npx vitest run src`
- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Build: `npm run build`
All four must pass before proposing any change as done.

## Forbidden actions
- No new dependencies without explicit approval.
- No edits inside `node_modules/`, `dist/`, or any unrelated project folder.
- No committing secrets, `.env` files, or real personal/user data.
- No direct push to `main`; propose changes as a diff for human review first.

## Review gate
- Every change must include: the diff, test output (before/after), and a one-line
  summary of what changed and why. A human approves before merge.
