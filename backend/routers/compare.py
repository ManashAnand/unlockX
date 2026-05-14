import asyncio
import json
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from models.schemas import CompareRequest, PlayerData, CompareResult
from services.scraper import scrape_profile_and_tweets
from services.analytics import compute_analytics, classify_tones, classify_topics, get_top_tweets
from services.llm import generate_ai_insights
from services.cache import get_cached_profile, set_cached_profile

router = APIRouter(prefix="/api")


def _sse(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"


async def _build_player(handle: str) -> tuple[PlayerData, bool]:
    """Returns (player_data, was_cached)."""
    cached = get_cached_profile(handle)
    if cached:
        return cached, True

    profile, tweets = await scrape_profile_and_tweets(handle, max_items=100)
    analytics = compute_analytics(profile, tweets)
    tone = classify_tones(tweets)
    topics = classify_topics(tweets)
    top_tweets = get_top_tweets(tweets)

    player = PlayerData(
        profile=profile,
        analytics=analytics,
        tone=tone,
        topics=topics,
        top_tweets=top_tweets,
    )
    set_cached_profile(handle, player)
    return player, False


@router.get("/compare/stream")
async def compare_stream(handle_a: str, handle_b: str):
    async def generate():
        try:
            # Process A
            yield _sse("status", {"step": "scraping_a", "message": f"Fetching data for {handle_a}…"})
            player_a, cached_a = await _build_player(handle_a)
            yield _sse("profile", {"side": "a", "data": player_a.model_dump(), "cached": cached_a})
            yield _sse("status", {"step": "done_a", "message": f"{handle_a} analyzed ✓"})

            # Process B
            yield _sse("status", {"step": "scraping_b", "message": f"Fetching data for {handle_b}…"})
            player_b, cached_b = await _build_player(handle_b)
            yield _sse("profile", {"side": "b", "data": player_b.model_dump(), "cached": cached_b})
            yield _sse("status", {"step": "done_b", "message": f"{handle_b} analyzed ✓"})

            # AI insights (blocking Groq call → run in thread pool)
            yield _sse("status", {"step": "ai", "message": "Generating AI growth analysis…"})
            insights = await asyncio.to_thread(generate_ai_insights, player_a, player_b)
            yield _sse("status", {"step": "done_ai", "message": "Analysis complete ✓"})

            # Final result
            result = CompareResult(a=player_a, b=player_b, ai_insights=insights)
            yield _sse("complete", result.model_dump())

        except Exception as exc:
            yield _sse("error", {"message": str(exc)})

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@router.post("/compare")
async def compare_one_shot(req: CompareRequest) -> CompareResult:
    player_a, _ = await _build_player(req.handle_a)
    player_b, _ = await _build_player(req.handle_b)
    insights = await asyncio.to_thread(generate_ai_insights, player_a, player_b)
    return CompareResult(a=player_a, b=player_b, ai_insights=insights)


@router.get("/health")
async def health():
    return {"status": "ok"}
