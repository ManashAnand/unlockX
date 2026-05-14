from pydantic import BaseModel
from typing import Optional


class CompareRequest(BaseModel):
    handle_a: str
    handle_b: str


class ProfileData(BaseModel):
    handle: str
    name: str
    bio: str
    followers: int
    following: int
    posts: int
    initials: str
    verified: bool
    account_age_days: int


class AnalyticsData(BaseModel):
    tweet_count: int = 0
    posting_frequency: float
    avg_engagement: float
    engagement_rate: float
    consistency_score: int
    avg_likes: float
    avg_retweets: float
    avg_replies: float
    top_post_likes: int
    thread_ratio: float
    media_ratio: float
    reply_ratio: float
    best_posting_hours: list[int]


class ToneItem(BaseModel):
    label: str
    value: int


class TopicItem(BaseModel):
    label: str
    value: int


class TweetData(BaseModel):
    content: str
    likes: int
    retweets: int
    replies: int
    date: str


class PlayerData(BaseModel):
    profile: ProfileData
    analytics: AnalyticsData
    tone: list[ToneItem]
    topics: list[TopicItem]
    top_tweets: list[TweetData]


class AIInsights(BaseModel):
    summary: str
    why_a_grows_faster: list[str]
    recommendations_for_b: list[str]
    creator_dna_a: str
    creator_dna_b: str
    underdog_handle: str
    underdog_tips: list[str]


class CompareResult(BaseModel):
    a: PlayerData
    b: PlayerData
    ai_insights: AIInsights
