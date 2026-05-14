import os
import json
from groq import Groq
from models.schemas import PlayerData, AIInsights


def _build_summary(label: str, player: PlayerData) -> str:
    p = player.profile
    a = player.analytics
    top_topics = ", ".join(f"{t.label} ({t.value}%)" for t in player.topics[:3])
    top_tone = ", ".join(f"{t.label} ({t.value}%)" for t in player.tone[:3])
    return (
        f"{label}: {p.handle} — {p.followers:,} followers\n"
        f"  Posting: {a.posting_frequency:.1f}x/day, consistency {a.consistency_score}/100\n"
        f"  Avg engagement: {a.avg_engagement:.0f} "
        f"(likes {a.avg_likes:.0f}, RTs {a.avg_retweets:.0f}, replies {a.avg_replies:.0f})\n"
        f"  Engagement rate: {a.engagement_rate:.2f}%\n"
        f"  Top topics: {top_topics}\n"
        f"  Dominant tone: {top_tone}\n"
        f"  Thread ratio: {a.thread_ratio:.0%}, "
        f"media ratio: {a.media_ratio:.0%}, "
        f"reply ratio: {a.reply_ratio:.0%}"
    )


def generate_ai_insights(player_a: PlayerData, player_b: PlayerData) -> AIInsights:
    client = Groq(api_key=os.environ["GROQ_API_KEY"])

    summary_a = _build_summary("Creator A", player_a)
    summary_b = _build_summary("Creator B", player_b)

    # Identify underdog (fewer followers)
    if player_a.profile.followers <= player_b.profile.followers:
        underdog_handle = player_a.profile.handle
        leader_handle = player_b.profile.handle
    else:
        underdog_handle = player_b.profile.handle
        leader_handle = player_a.profile.handle

    prompt = f"""You are an expert Twitter/X growth analyst. Analyze these two creators and explain the growth dynamics.

{summary_a}

{summary_b}

IMPORTANT: {underdog_handle} has FEWER followers than {leader_handle}. Always analyze what {underdog_handle} can specifically learn from {leader_handle}'s strategy.

Respond in this exact JSON format (raw JSON only, no markdown fences):
{{
  "summary": "2-3 sentence overall comparison referencing specific numbers",
  "why_a_grows_faster": [
    "specific data-driven reason 1 about why Creator A outperforms or differs from Creator B",
    "specific data-driven reason 2",
    "specific data-driven reason 3",
    "specific data-driven reason 4",
    "specific data-driven reason 5"
  ],
  "recommendations_for_b": [
    "specific actionable recommendation for Creator B referencing Creator A's numbers",
    "specific actionable recommendation 2",
    "specific actionable recommendation 3",
    "specific actionable recommendation 4",
    "specific actionable recommendation 5"
  ],
  "creator_dna_a": "3-5 word creator identity (e.g. Niche authority educator)",
  "creator_dna_b": "3-5 word creator identity (e.g. Scattered multi-topic poster)",
  "underdog_handle": "{underdog_handle}",
  "underdog_tips": [
    "Specific thing {underdog_handle} should steal/copy/learn from {leader_handle}'s strategy with exact numbers",
    "Specific posting habit or content pattern {leader_handle} uses that {underdog_handle} should adopt",
    "Specific engagement tactic that explains {leader_handle}'s follower advantage",
    "One mindset or positioning shift {underdog_handle} needs to make based on the data",
    "One quick win {underdog_handle} can implement this week to close the gap"
  ]
}}

Be brutally honest. Reference actual numbers. Do not be generic."""

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=1024,
    )

    raw = completion.choices[0].message.content.strip()

    # Strip markdown fences if present
    if raw.startswith("```"):
        parts = raw.split("```")
        raw = parts[1] if len(parts) > 1 else raw
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    data = json.loads(raw)
    return AIInsights(**data)
