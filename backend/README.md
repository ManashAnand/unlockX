# UnlockX Backend

FastAPI service that powers the UnlockX Twitter Creator Intelligence platform.

---

## Tech

- **FastAPI** — async REST + SSE streaming
- **Groq** (`llama-3.1-8b-instant`) — AI insights generation
- **RapidAPI twitter154** — Twitter profile + tweet scraping
- **Supabase** — profile cache, comparison cache, user comparisons
- **Pydantic v2** — request/response validation
- **httpx** — async HTTP client for scraping

---

## Setup

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # fill in your keys
uvicorn main:app --reload       # http://localhost:8000
```

### Environment variables

```env
# AI
GROQ_API_KEY=gsk_...

# Twitter scraping
RAPIDAPI_KEY=your-key
RAPIDAPI_HOST=twitter154.p.rapidapi.com

# Supabase (service role — bypasses RLS)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJ...

# Config
CACHE_TTL_HOURS=6
FRONTEND_URL=http://localhost:3000
```

---

## Project structure

```
backend/
├── main.py                  # FastAPI app, CORS, router registration
├── requirements.txt
├── .env
│
├── routers/
│   └── compare.py           # GET /api/compare/stream  (SSE)
│                            # POST /api/compare        (one-shot)
│                            # GET /api/health
│
├── services/
│   ├── scraper.py           # RapidAPI twitter154 scraper
│   ├── analytics.py         # Engagement metrics, tone, topics
│   ├── llm.py               # Groq AI insights prompt + parsing
│   └── cache.py             # Supabase profile + comparison cache
│
├── models/
│   └── schemas.py           # All Pydantic models
│
└── db/
    └── schema.sql           # Supabase table definitions + RLS
```

---

## API

### `GET /api/compare/stream`

Server-Sent Events stream. Yields events progressively as each step completes.

**Query params:**
| Param | Type | Default | Description |
|---|---|---|---|
| `handle_a` | string | required | First Twitter handle |
| `handle_b` | string | required | Second Twitter handle |
| `max_posts` | int | 20 | Posts to scrape per creator (20 / 50 / 100) |

**Event types:**
| Event | Payload |
|---|---|
| `status` | `{ step, message }` — progress update |
| `profile` | `{ side: "a"/"b", data: PlayerData, cached: bool }` |
| `complete` | Full `CompareResult` JSON |
| `error` | `{ message }` |

**Cache behaviour:**
1. Checks `comparison_cache` first (keyed by sorted `handle_a + handle_b`)
2. Cache hit → streams stored result instantly (no scraping, no AI call)
3. Cache miss → full pipeline → saves to `comparison_cache`

---

## Caching layers

| Cache | Table | TTL | Key |
|---|---|---|---|
| Profile cache | `profile_cache` | 6h | `handle` |
| Comparison cache | `comparison_cache` | 6h | `(handle_a, handle_b)` sorted |

Both use `SUPABASE_SERVICE_KEY` (service role, bypasses RLS). If Supabase is unreachable, caches are silently skipped and a fresh scrape runs.

---

## Analytics pipeline

1. **Scrape** — profile details + up to `max_posts` tweets (excluding retweets, paginated)
2. **Compute analytics** — engagement rate, posting frequency, consistency score, tone/topic classification
3. **AI insights** — Groq LLM generates JSON with reasons, recommendations, creator DNA, underdog tips
4. **Stream** — each step yields an SSE event; frontend renders progressively

---

## Database schema

Run `db/schema.sql` in Supabase SQL editor:

```sql
-- profile_cache      — server-only (service_role access)
-- comparison_cache   — server-only (service_role access)
-- users              — Google OAuth user emails, RLS: own row only
-- user_comparisons   — per-user comparison history
--                      RLS: own write + public read (for leaderboard)
```

---

## Deployment

The backend is a standard ASGI app. Deploy to **Railway**, **Render**, or any platform that supports Python:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

Set all environment variables in the platform dashboard. The `FRONTEND_URL` is used for CORS — set it to your Vercel deployment URL.
