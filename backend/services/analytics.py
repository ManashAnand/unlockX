import numpy as np
from collections import Counter
from models.schemas import (
    ProfileData, TweetData, AnalyticsData,
    ToneItem, TopicItem,
)

TONE_PATTERNS: dict[str, list[str]] = {
    "Educational": [
        "how to", "guide", "learn", "explain", "tip", "trick",
        "lesson", "tutorial", "understand", "because", "reason", "here's why",
    ],
    "Motivational": [
        "you can", "believe", "success", "never give up", "grind", "hustle",
        "dream", "achieve", "inspire", "motivation", "keep going",
    ],
    "Technical": [
        "code", "algorithm", "api", "function", "python", "javascript",
        "model", "deploy", "database", "architecture", "llm", "framework",
    ],
    "Opinion": [
        "i think", "hot take", "unpopular opinion", "controversial", "disagree",
        "actually", "wrong about", "fact:", "truth:", "fight me",
    ],
    "Storytelling": [
        "thread", "story", "started", "years ago", "once", "journey",
        "experience", "what happened", "moment", "let me tell",
    ],
    "Promotional": [
        "check out", "launch", "announcing", "buy", "sign up", "subscribe",
        "new product", "link in bio", "discount", "free", "just dropped",
    ],
    "Personal": [
        "i feel", "honestly", "personal", "family", "today i", "my life",
        "confession", "vulnerable", "struggled", "grateful",
    ],
    "Meme/Humor": [
        "lol", "lmao", "💀", "joke", "funny", "meme", "haha",
        "fr fr", "no cap", "bruh", "ngl", "😂",
    ],
}

TOPIC_PATTERNS: dict[str, list[str]] = {
    "AI/ML": [
        "ai", "llm", "gpt", "machine learning", "neural", "openai", "claude",
        "artificial intelligence", "model", "transformer", "embedding",
    ],
    "Startups": [
        "startup", "founder", "yc", "funding", "seed", "series a", "saas",
        "mrr", "arr", "entrepreneur", "vc", "venture",
    ],
    "Productivity": [
        "productivity", "focus", "deep work", "habit", "routine",
        "system", "workflow", "time management", "second brain",
    ],
    "Career": [
        "career", "job", "hiring", "resume", "interview",
        "salary", "promotion", "work life", "linkedin",
    ],
    "Crypto/Web3": [
        "bitcoin", "crypto", "web3", "nft", "ethereum",
        "defi", "blockchain", "token", "wallet",
    ],
    "Tech/Dev": [
        "javascript", "python", "typescript", "github", "open source",
        "software", "developer", "programming", "react", "backend",
    ],
    "Business": [
        "revenue", "profit", "growth", "marketing", "sales",
        "customer", "product market fit", "b2b", "gtm",
    ],
    "Personal Dev": [
        "mindset", "mental health", "self improvement", "reading",
        "book", "meditation", "journal", "discipline",
    ],
}


def classify_tones(tweets: list[TweetData]) -> list[ToneItem]:
    scores: Counter = Counter()
    for tweet in tweets:
        text = tweet.content.lower()
        for tone, keywords in TONE_PATTERNS.items():
            if any(kw in text for kw in keywords):
                scores[tone] += 1

    total = sum(scores.values()) or 1
    top = scores.most_common(5)
    if not top:
        return [ToneItem(label="General", value=100)]

    result = [ToneItem(label=k, value=round(v / total * 100)) for k, v in top]
    # Adjust so they sum to 100
    diff = 100 - sum(r.value for r in result)
    result[0] = ToneItem(label=result[0].label, value=result[0].value + diff)
    return result


def classify_topics(tweets: list[TweetData]) -> list[TopicItem]:
    scores: Counter = Counter()
    for tweet in tweets:
        text = tweet.content.lower()
        for topic, keywords in TOPIC_PATTERNS.items():
            if any(kw in text for kw in keywords):
                scores[topic] += 1

    total = sum(scores.values()) or 1
    top = scores.most_common(5)
    if not top:
        return [TopicItem(label="General", value=100)]

    result = [TopicItem(label=k, value=round(v / total * 100)) for k, v in top]
    diff = 100 - sum(r.value for r in result)
    result[0] = TopicItem(label=result[0].label, value=result[0].value + diff)
    return result


def compute_analytics(
    profile: ProfileData,
    tweets: list[TweetData],
) -> AnalyticsData:
    if not tweets:
        return AnalyticsData(
            posting_frequency=0.0,
            avg_engagement=0.0,
            engagement_rate=0.0,
            consistency_score=0,
            avg_likes=0.0,
            avg_retweets=0.0,
            avg_replies=0.0,
            top_post_likes=0,
            thread_ratio=0.0,
            media_ratio=0.0,
            reply_ratio=0.0,
            best_posting_hours=[9, 14, 20],
        )

    likes = np.array([t.likes for t in tweets], dtype=float)
    retweets = np.array([t.retweets for t in tweets], dtype=float)
    replies = np.array([t.replies for t in tweets], dtype=float)

    avg_likes = float(np.mean(likes))
    avg_retweets = float(np.mean(retweets))
    avg_replies = float(np.mean(replies))
    avg_engagement = avg_likes + avg_retweets + avg_replies

    followers = max(profile.followers, 1)
    engagement_rate = (avg_engagement / followers) * 100

    days_span = min(max(profile.account_age_days, 1), 90)
    posting_frequency = len(tweets) / days_span

    # Consistency: lower coefficient of variation → higher score
    if len(likes) > 1:
        mean_likes = np.mean(likes)
        cv = float(np.std(likes) / max(mean_likes, 1))
        consistency_score = max(0, min(100, int(100 - cv * 25)))
    else:
        consistency_score = 50

    thread_ratio = sum(1 for t in tweets if len(t.content) > 200) / len(tweets)
    media_ratio = sum(1 for t in tweets if "http" in t.content.lower()) / len(tweets)
    reply_ratio = sum(1 for t in tweets if t.content.startswith("@")) / len(tweets)

    return AnalyticsData(
        tweet_count=len(tweets),
        posting_frequency=round(posting_frequency, 2),
        avg_engagement=round(avg_engagement, 1),
        engagement_rate=round(engagement_rate, 3),
        consistency_score=consistency_score,
        avg_likes=round(avg_likes, 1),
        avg_retweets=round(avg_retweets, 1),
        avg_replies=round(avg_replies, 1),
        top_post_likes=int(np.max(likes)) if len(likes) > 0 else 0,
        thread_ratio=round(thread_ratio, 3),
        media_ratio=round(media_ratio, 3),
        reply_ratio=round(reply_ratio, 3),
        best_posting_hours=[9, 14, 20],
    )


def get_top_tweets(tweets: list[TweetData], n: int = 2) -> list[TweetData]:
    return sorted(tweets, key=lambda t: t.likes + t.retweets, reverse=True)[:n]
