# Smart Campus Room Availability Checker

A client-side tool (Vite + React + TypeScript) to check whether a lecture room
is free for a given time window. One fictional room dataset, no login, no
database — see `src/data.ts` for the sample rooms and bookings.

## Setup

```bash
npm install
npm run dev       # local dev server
```

## Verification commands

```bash
npx vitest run src   # unit tests (17 tests over src/utils.ts)
npm run typecheck     # tsc --noEmit
npm run lint           # eslint
npm run build          # production build
```

## Acceptance criteria (see AGENTS.md for the full contract)

- AC1: reject invalid/past start-end times.
- AC2: reject bookings longer than 120 minutes.
- AC3: reject bookings for a blocked room.
- AC4: reject overlapping bookings; touching endpoints are allowed.
- AC5: `checkAvailability` never mutates the room/booking data it is given.

## Project status

- BUG-A (touching-endpoints treated as a conflict) and BUG-B (bookings array
  mutated by `sort`) from Practice #09 are both fixed in `src/utils.ts`.
- See `bug-a.diff`, `bug-b.diff`, and the `bug-a-*` / `bug-b-*` files for the
  original defect evidence from that practice.
