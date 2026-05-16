import os
import httpx
from datetime import datetime, timezone
from dateutil import parser as dateparser
from models.schemas import ProfileData, TweetData

BASE_URL = "https://twitter154.p.rapidapi.com"


def _headers() -> dict:
    return {
        "x-rapidapi-key": os.environ["RAPIDAPI_KEY"],
        "x-rapidapi-host": os.environ.get("RAPIDAPI_HOST", "twitter154.p.rapidapi.com"),
    }


def _relative_date(creation_date_str: str) -> str:
    try:
        created = dateparser.parse(creation_date_str)
        delta = datetime.now(timezone.utc) - created.replace(tzinfo=timezone.utc)
        if delta.days >= 1:
            return f"{delta.days}d ago"
        hours = delta.seconds // 3600
        return f"{hours}h ago" if hours >= 1 else "just now"
    except Exception:
        return "recently"


def _account_age_days(creation_date_str: str) -> int:
    try:
        created = dateparser.parse(creation_date_str)
        return (datetime.now(timezone.utc) - created.replace(tzinfo=timezone.utc)).days
    except Exception:
        return 365


async def scrape_profile_and_tweets(
    handle: str,
    max_items: int = 100,
) -> tuple[ProfileData, list[TweetData]]:
    handle_clean = handle.lstrip("@")
    headers = _headers()

    async with httpx.AsyncClient(timeout=30.0) as client:
        # 1. Fetch user profile
        profile_r = await client.get(
            f"{BASE_URL}/user/details",
            params={"username": handle_clean},
            headers=headers,
        )
        profile_r.raise_for_status()
        u = profile_r.json()

        name = u.get("name") or handle_clean
        words = name.split()
        initials = "".join(w[0].upper() for w in words[:2]) if words else handle_clean[:2].upper()

        profile = ProfileData(
            handle=f"@{handle_clean}",
            name=name,
            bio=u.get("description") or "",
            followers=int(u.get("follower_count", 0)),
            following=int(u.get("following_count", 0)),
            posts=int(u.get("number_of_tweets", 0)),
            initials=initials,
            verified=bool(u.get("is_blue_verified") or u.get("is_verified", False)),
            account_age_days=_account_age_days(u.get("creation_date", "")),
        )

        # 2. Fetch tweets — paginate until max_items
        tweets: list[TweetData] = []
        continuation_token: str | None = None
        per_page = min(40, max_items)

        while len(tweets) < max_items:
            params: dict = {
                "username": handle_clean,
                "limit": str(per_page),
                "include_replies": "false",
                "include_pinned": "false",
            }
            if continuation_token:
                params["continuation_token"] = continuation_token

            tweets_r = await client.get(
                f"{BASE_URL}/user/tweets",
                params=params,
                headers=headers,
            )
            tweets_r.raise_for_status()
            data = tweets_r.json()

            results = data.get("results", [])
            if not results:
                break

            for item in results:
                if item.get("retweet"):
                    continue
                content = (item.get("text") or "").strip()
                tweets.append(TweetData(
                    content=content[:280],
                    likes=int(item.get("favorite_count", 0)),
                    retweets=int(item.get("retweet_count", 0)),
                    replies=int(item.get("reply_count", 0)),
                    date=_relative_date(item.get("creation_date", "")),
                ))

            continuation_token = data.get("continuation_token")
            if not continuation_token:
                break

    if not tweets:
        raise ValueError(f"No tweets found for @{handle_clean}")

    return profile, tweets
