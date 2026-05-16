# UnlockX — Twitter Creator Intelligence

AI-powered side-by-side comparison of any two Twitter/X creators. See who grows faster, why, and what to learn — in seconds.

🔗 **Live:** [unlockx.ai](https://unlockx.ai)

---

## What it does

Enter two Twitter handles → UnlockX scrapes their latest posts, runs analytics, and generates a full AI breakdown:

- **Profile comparison** — followers, engagement rate, posting frequency
- **Growth trajectory chart** — estimated follower curves over time
- **AI insights** — why one creator outperforms the other, with real numbers
- **Underdog blueprint** — personalised tips for the creator with fewer followers
- **X Algorithm Playbook** — 8 data-driven signals scored against the 2025 X algorithm
- **Verdict** — overall winner across 8 metrics with a shareable tweet

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Recharts |
| Backend | FastAPI, Python 3.11, Groq (llama-3.1-8b) |
| Database | Supabase (PostgreSQL + Auth) |
| Scraping | RapidAPI twitter154 |
| Auth | Google OAuth via Supabase |
| Analytics | Vercel Analytics |
| Hosting | Vercel (frontend) + Railway/Render (backend) |

---

## Project structure

```
unlockx/
├── frontend/          # Next.js 14 app
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/# UI components
│   │   ├── hooks/     # useCompare hook
│   │   ├── lib/       # API client, Supabase, types
│   │   └── styles/    # Design tokens CSS
│   └── public/        # Static assets (logo)
│
└── backend/           # FastAPI service
    ├── main.py
    ├── routers/       # API endpoints
    ├── services/      # Scraper, analytics, LLM, cache
    ├── models/        # Pydantic schemas
    └── db/            # SQL schema
```

---

## Quick start

See [frontend/README.md](./frontend/README.md) and [backend/README.md](./backend/README.md) for setup instructions.

**TL;DR:**
```bash
# Backend
cd backend && python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend && npm install && npm run dev
```

---

## Environment variables

### Frontend (`frontend/.env`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Backend (`backend/.env`)
```
GROQ_API_KEY=your-groq-key
RAPIDAPI_KEY=your-rapidapi-key
RAPIDAPI_HOST=twitter154.p.rapidapi.com
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
CACHE_TTL_HOURS=6
FRONTEND_URL=http://localhost:3000
```

---

## Database

Run `backend/db/schema.sql` in your Supabase SQL editor to create all tables:
- `users` — stores Google OAuth user emails
- `profile_cache` — caches scraped Twitter profiles (6h TTL)
- `comparison_cache` — caches full comparison results (6h TTL)
- `user_comparisons` — stores each user's comparison history

---

## License

MIT
