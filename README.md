# Präferenzwahl — Demonstrationsmodell

A civic-tech prototype that simulates a hypothetical three-preference voting
system. Voters cast a primary vote and two fallback votes; if the primary
party falls below the 5% threshold, the ballot transfers to the next
preference. The application shows the redistribution transparently, backed by
a persistent aggregate of all submitted ballots.

This project is a **simulation**. It is not an official election, makes no
political recommendation, and is not affiliated with any party.

## Tech

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** with a paper-tone, institutional palette
- **Framer Motion** for quiet, purposeful animation
- **Recharts** for the data visualizations
- **Prisma** + **PostgreSQL** for persistence
- **Zustand** (with `persist`) for the in-flow ballot draft

## Project structure

```
prisma/
├── schema.prisma         # Party / VoteSession / VotePreference
└── seed.ts               # Seeds PARTIES into the database

src/
├── app/
│   ├── layout.tsx        # Fonts, shell, header/footer
│   ├── page.tsx          # Landing
│   ├── vote/
│   │   ├── layout.tsx
│   │   ├── step-1/       # Primary preference
│   │   ├── step-2/       # Fallback 1
│   │   ├── step-3/       # Fallback 2
│   │   └── review/       # Ballot + stamp + urn + submit
│   ├── results/          # Aggregated results page
│   ├── methodology/      # Rules of the simulation
│   └── api/
│       ├── vote/         # POST: submit a ballot
│       ├── results/      # GET: live aggregate
│       └── parties/      # GET: active party catalog
├── components/
│   ├── header.tsx / footer.tsx
│   ├── progress-stepper.tsx
│   ├── party-picker.tsx
│   ├── ballot.tsx / ballot-urn.tsx
│   ├── results/          # Visualisation pieces
│   └── ui/               # Minimal primitives (button, card, input, badge)
├── lib/
│   ├── parties.ts        # Central party catalog (single source of truth)
│   ├── simulation.ts     # Three-preference algorithm + seat distribution
│   ├── store.ts          # Zustand store for the ballot draft
│   ├── db.ts             # Prisma client singleton
│   └── utils.ts          # cn, formatters
└── types/
    └── results.ts
```

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the database

Copy the example environment file and point `DATABASE_URL` at a PostgreSQL
instance. The easiest local setup:

```bash
cp .env.example .env
docker run --name rcv-pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
```

### 3. Run migrations and seed parties

```bash
npx prisma migrate dev --name init
npm run prisma:seed
```

### 4. Start the dev server

```bash
npm run dev
```

Open http://localhost:3000 and cast a few ballots. The `/results` page
updates live from the database on every request.

## Customising the party catalog

All parties live in `src/lib/parties.ts`. To add, reorder, recolor, or hide a
party, edit that file and re-run the seed (`npm run prisma:seed`). No
component needs to change — the UI, charts, seat diagram, validation and API
all read from this catalog.

Use `active: false` to hide a party from the UI without dropping existing
votes from the database.

## How the simulation works

The rules are documented in plain language at `/methodology` and in the
source at `src/lib/simulation.ts`. In short:

1. Count everyone's first preference.
2. Eliminate any party below 5% from the final tally.
3. For ballots whose first preference was eliminated, move the vote to the
   second preference (or the third, if the second is also eliminated).
4. If all three preferences were eliminated, the ballot is exhausted — it
   does not inflate any other party's share.
5. The seat distribution uses Sainte-Laguë / Schepers (as in the Bundestag).

Both the pre-threshold tally and every transfer are returned by the
simulation so the UI can render the redistribution step-by-step.

## Accessibility

- Semantic landmarks, `aria-current` on the active step, `role="radiogroup"`
  on the party picker, keyboard navigation and focus rings everywhere.
- Respects `prefers-reduced-motion` — animations collapse to near-instant.
- Color choices hold up against WCAG AA for body text on paper surfaces.

## Deployment

The project is ready for Vercel (`vercel deploy`). Provide `DATABASE_URL` via
your host; Prisma is generated automatically on `postinstall`. Remember to
run `prisma migrate deploy` and the seed in the deployment pipeline.

## Scripts

| Command              | Purpose                             |
| -------------------- | ----------------------------------- |
| `npm run dev`        | Local development with hot reload   |
| `npm run build`      | Production build (`next build`)     |
| `npm run start`      | Run the production build            |
| `npm run lint`       | Lint with Next's ESLint config      |
| `npm run prisma:seed`| Upsert the party catalog            |
| `npm run prisma:migrate` | `prisma migrate dev`             |
