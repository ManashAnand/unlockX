# UnlockX Frontend

Next.js 14 app for the UnlockX Twitter Creator Intelligence platform.

---

## Tech

- **Next.js 14** — App Router, server + client components
- **TypeScript** — strict mode
- **Tailwind CSS** — utility-first styling with custom design tokens
- **Supabase** (`@supabase/ssr`) — Google OAuth + user data
- **Recharts** — follower growth trajectory chart
- **Three.js + postprocessing** — WebGL GridScan idle background
- **Vercel Analytics** — page view and event tracking

---

## Setup

```bash
npm install
cp .env.example .env        # fill in your values
npm run dev                  # http://localhost:3000
```

### Environment variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                  # Main comparison page
│   ├── layout.tsx                # Root layout, aurora bg, metadata
│   ├── globals.css               # Keyframe animations
│   ├── login/page.tsx            # Google OAuth login
│   ├── comparisons/page.tsx      # User comparison history
│   └── auth/callback/route.ts    # OAuth callback handler
│
├── components/
│   ├── Nav.tsx                   # Sticky nav with logo + user pill
│   ├── CompareBar.tsx            # Handle inputs + post count selector
│   ├── ProfileCard.tsx           # Creator profile card (A or B)
│   ├── HeroMetric.tsx            # Headline engagement rate comparison
│   ├── GrowthChart.tsx           # Recharts follower trajectory
│   ├── CompareTable.tsx          # Full metrics table
│   ├── TopPosts.tsx              # Top 3 tweets per creator
│   ├── ToneBreakdown.tsx         # Tone/voice analysis bars
│   ├── TopicDistribution.tsx     # Topic category bars
│   ├── AIInsights.tsx            # AI growth analysis + creator DNA
│   ├── VerdictBanner.tsx         # Winner card + share on X button
│   ├── AlgorithmPlaybook.tsx     # 8-signal X algorithm scorecard
│   ├── ComparisonCard.tsx        # History/trending card (clickable)
│   ├── LoadingState.tsx          # SSE progress indicator
│   ├── MirrorGrid.tsx            # Two-column layout wrapper
│   ├── GridScan.jsx              # Three.js WebGL idle background
│   └── VsPill.tsx                # "VS" divider pill
│
├── hooks/
│   └── useCompare.ts             # SSE streaming + Supabase save
│
├── lib/
│   ├── api.ts                    # streamCompare() SSE client
│   ├── supabase-client.ts        # createBrowserClient factory
│   └── types.ts                  # All TypeScript interfaces
│
└── styles/
    └── tokens.css                # Design system CSS variables
```

---

## Key features

### SSE streaming
Results stream progressively — profile A appears before profile B is even fetched. Implemented via `EventSource` in `lib/api.ts` and `useCompare` hook.

### Comparison caching
The backend caches full comparison results for 6 hours. Re-running the same pair loads instantly from the database.

### Post count selector
Users choose 20 / 50 / 100 posts to analyse. Default is 20 (fast). Higher counts give more accurate analytics but take longer.

### URL-based sharing
Any comparison can be linked as `/?a=@handle1&b=@handle2` — the page auto-triggers the comparison on load.

### Auth gate
`middleware.ts` redirects unauthenticated users to `/login`. All pages except `/login` and `/auth/callback` are protected.

---

## Scripts

```bash
npm run dev      # development server (port 3000)
npm run build    # production build
npm run start    # serve production build
```

---

## Deployment (Vercel)

1. Connect the `unlockx` GitHub repo to Vercel
2. Set **Root Directory** to `frontend`
3. Add all `NEXT_PUBLIC_*` environment variables in Vercel dashboard
4. Deploy — Vercel detects Next.js automatically
