import os
import logging
from datetime import datetime, timezone, timedelta
from models.schemas import PlayerData

logger = logging.getLogger(__name__)


def _get_supabase():
    try:
        from supabase import create_client
        url = os.environ.get("SUPABASE_URL", "")
        key = os.environ.get("SUPABASE_SERVICE_KEY", "")
        if not url or not key:
            return None
        return create_client(url, key)
    except Exception as e:
        logger.warning("Supabase unavailable: %s", e)
        return None


def _is_fresh(updated_at_str: str) -> bool:
    ttl = int(os.environ.get("CACHE_TTL_HOURS", 6))
    updated_at = datetime.fromisoformat(updated_at_str.replace("Z", "+00:00"))
    return datetime.now(timezone.utc) - updated_at < timedelta(hours=ttl)


def get_cached_profile(handle: str) -> PlayerData | None:
    sb = _get_supabase()
    if not sb:
        return None
    try:
        clean = handle.lstrip("@").lower()
        result = sb.table("profile_cache").select("*").eq("handle", clean).execute()
        if not result.data:
            return None
        row = result.data[0]
        if not _is_fresh(row["updated_at"]):
            return None
        return PlayerData(
            profile=row["profile_data"],
            analytics=row["analytics_data"],
            tone=row["tone_data"],
            topics=row["topics_data"],
            top_tweets=row["top_tweets"],
        )
    except Exception as e:
        logger.warning("Cache read failed: %s", e)
        return None


def set_cached_profile(handle: str, player: PlayerData) -> None:
    sb = _get_supabase()
    if not sb:
        return
    try:
        clean = handle.lstrip("@").lower()
        sb.table("profile_cache").upsert({
            "handle": clean,
            "profile_data": player.profile.model_dump(),
            "analytics_data": player.analytics.model_dump(),
            "tone_data": [t.model_dump() for t in player.tone],
            "topics_data": [t.model_dump() for t in player.topics],
            "top_tweets": [t.model_dump() for t in player.top_tweets],
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }).execute()
    except Exception as e:
        logger.warning("Cache write failed: %s", e)


def _normalize_handles(handle_a: str, handle_b: str) -> tuple[str, str]:
    """Always return handles in alphabetical order so A-B and B-A hit the same cache row."""
    a = handle_a.lstrip("@").lower()
    b = handle_b.lstrip("@").lower()
    return (a, b) if a <= b else (b, a)


def get_cached_comparison(handle_a: str, handle_b: str):
    """Returns the cached CompareResult dict, or None if missing/stale."""
    from models.schemas import CompareResult
    sb = _get_supabase()
    if not sb:
        return None
    try:
        a, b = _normalize_handles(handle_a, handle_b)
        # Order by created_at DESC so we always get the freshest row first
        result = (
            sb.table("comparison_cache")
            .select("*")
            .eq("handle_a", a)
            .eq("handle_b", b)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )
        if not result.data:
            return None
        row = result.data[0]
        if not _is_fresh(row["created_at"]):
            logger.info("Comparison cache stale for %s vs %s", a, b)
            return None
        logger.info("Comparison cache HIT for %s vs %s", a, b)
        return CompareResult(**row["result"])
    except Exception as e:
        logger.warning("Comparison cache read failed: %s", e)
        return None


def set_cached_comparison(handle_a: str, handle_b: str, result) -> None:
    sb = _get_supabase()
    if not sb:
        return
    try:
        a, b = _normalize_handles(handle_a, handle_b)
        sb.table("comparison_cache").upsert(
            {
                "handle_a": a,
                "handle_b": b,
                "result": result.model_dump(),
                "created_at": datetime.now(timezone.utc).isoformat(),
            },
            on_conflict="handle_a,handle_b",
        ).execute()
        logger.info("Comparison cache SET for %s vs %s", a, b)
    except Exception as e:
        logger.warning("Comparison cache write failed: %s", e)
